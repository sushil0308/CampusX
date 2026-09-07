package com.campusx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CampusXApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusXApplication.class, args);
    }
}
