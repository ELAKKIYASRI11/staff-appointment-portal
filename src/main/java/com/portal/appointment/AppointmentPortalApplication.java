package com.portal.appointment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AppointmentPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppointmentPortalApplication.class, args);
    }
}
