package com.docapp.controller;

import com.docapp.dto.request.PaymentVerifyRequest;
import com.docapp.dto.response.ApiResponse;
import com.docapp.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<Map<String, String>>> createOrder(@RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.createOrder(body.get("appointmentId"))));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<Boolean>> verify(@Valid @RequestBody PaymentVerifyRequest req) {
        boolean verified = paymentService.verifyPayment(req);
        if (verified) {
            return ResponseEntity.ok(ApiResponse.success("Payment verified", true));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Payment verification failed"));
    }
}
