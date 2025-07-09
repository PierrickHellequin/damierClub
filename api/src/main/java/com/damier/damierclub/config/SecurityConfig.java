package com.damier.damierclub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // désactive la protection CSRF (utile pour API)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // autorise toutes les requêtes
            )
            .formLogin(form -> form.disable()) // désactive le formulaire HTML
            .httpBasic(Customizer.withDefaults()); // facultatif, active Basic Auth (header Authorization)

        return http.build();
    }
}
