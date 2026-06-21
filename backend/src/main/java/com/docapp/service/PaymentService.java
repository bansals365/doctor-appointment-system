package com.docapp.service;

import com.docapp.dto.request.PaymentVerifyRequest;
import com.docapp.exception.ResourceNotFoundException;
import com.docapp.model.Appointment;
import com.docapp.model.Payment;
import com.docapp.repository.AppointmentRepository;
import com.docapp.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;

@Service
@Slf4j
public class PaymentService {

    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final String razorpayKeyId;
    private final String razorpayKeySecret;

    public PaymentService(AppointmentRepository appointmentRepository,
                          PaymentRepository paymentRepository,
                          @Value("${razorpay.key.id}") String razorpayKeyId,
                          @Value("${razorpay.key.secret}") String razorpayKeySecret) {
        this.appointmentRepository = appointmentRepository;
        this.paymentRepository = paymentRepository;
        this.razorpayKeyId = razorpayKeyId;
        this.razorpayKeySecret = razorpayKeySecret;
    }

    @Transactional
    public Map<String, String> createOrder(Long appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        BigDecimal amount = BigDecimal.valueOf(appt.getDoctor().getFees());

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "appt_" + appointmentId);

            Order order = client.orders.create(orderRequest);
            String orderId = order.get("id");

            Payment payment = Payment.builder()
                    .appointment(appt)
                    .amount(amount)
                    .razorpayOrderId(orderId)
                    .status(Payment.Status.PENDING)
                    .build();
            paymentRepository.save(payment);

            Map<String, String> response = new HashMap<>();
            response.put("orderId", orderId);
            response.put("amount", amount.toString());
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            return response;

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    @Transactional
    public boolean verifyPayment(PaymentVerifyRequest req) {
        try {
            String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String generated = HexFormat.of().formatHex(hash);

            if (!generated.equals(req.getRazorpaySignature())) {
                return false;
            }

            Payment payment = paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

            payment.setRazorpayPaymentId(req.getRazorpayPaymentId());
            payment.setStatus(Payment.Status.SUCCESS);
            paymentRepository.save(payment);

            Appointment appt = payment.getAppointment();
            appt.setStatus(Appointment.Status.CONFIRMED);
            appointmentRepository.save(appt);

            return true;
        } catch (Exception e) {
            log.error("Payment verification failed: {}", e.getMessage());
            return false;
        }
    }

    @Transactional
    public void payAtHospital(Long appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        BigDecimal amount = BigDecimal.valueOf(appt.getDoctor().getFees());

        // Reuse an existing payment row if the patient had started an online order,
        // otherwise create a fresh cash payment.
        Payment payment = paymentRepository.findByAppointmentId(appointmentId)
                .orElseGet(() -> Payment.builder().appointment(appt).build());
        payment.setAmount(amount);
        payment.setMethod(Payment.Method.CASH);
        payment.setStatus(Payment.Status.PENDING); // collected in person at the hospital
        paymentRepository.save(payment);

        appt.setStatus(Appointment.Status.CONFIRMED);
        appointmentRepository.save(appt);
    }
}
