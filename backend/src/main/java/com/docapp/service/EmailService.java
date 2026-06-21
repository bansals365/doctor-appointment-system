package com.docapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendBookingConfirmation(String toEmail, String patientName,
                                        String doctorName, LocalDate date, LocalTime time) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("Appointment Confirmed - DocApp");
            msg.setText(String.format(
                    "Dear %s,\n\nYour appointment with Dr. %s is confirmed.\n\nDate: %s\nTime: %s\n\nThank you for using DocApp!",
                    patientName, doctorName,
                    date.format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    time.format(DateTimeFormatter.ofPattern("hh:mm a"))
            ));
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Failed to send confirmation email: {}", e.getMessage());
        }
    }

    @Async
    public void sendCancellationEmail(String toEmail, String patientName, String doctorName) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("Appointment Cancelled - DocApp");
            msg.setText(String.format(
                    "Dear %s,\n\nYour appointment with Dr. %s has been cancelled.\n\nThank you for using DocApp!",
                    patientName, doctorName
            ));
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Failed to send cancellation email: {}", e.getMessage());
        }
    }
}
