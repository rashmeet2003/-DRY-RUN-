package com.dryrun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for the DryRun Full-Stack Backend API.
 * This class boots up the Spring application context, runs embedded Tomcat,
 * and initializes H2 database configurations.
 */
@SpringBootApplication
public class DryRunApplication {

    public static void main(String[] args) {
        SpringApplication.run(DryRunApplication.class, args);
    }
}
