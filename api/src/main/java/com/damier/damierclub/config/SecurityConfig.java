package com.damier.damierclub.config;

import com.damier.damierclub.security.HeaderAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final HeaderAuthenticationFilter headerAuthenticationFilter;

    public SecurityConfig(HeaderAuthenticationFilter headerAuthenticationFilter) {
        this.headerAuthenticationFilter = headerAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(c -> {})
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no authentication required (GET only)
                .requestMatchers(HttpMethod.GET, "/api/articles", "/api/articles/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/clubs", "/api/clubs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/notes", "/api/notes/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/members", "/api/members/**").permitAll()
                // Authentication endpoints - no authentication required
                .requestMatchers("/api/internal/login", "/api/internal/register").permitAll()
                // All other requests require authentication - @PreAuthorize will handle authorization
                .anyRequest().authenticated()
            )
            .addFilterBefore(headerAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .httpBasic(b -> b.disable())
            .formLogin(f -> f.disable());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3009",
            "http://127.0.0.1:3009"
        ));
        // Autoriser toutes méthodes / en-têtes pour éliminer causes CORS
        cfg.addAllowedMethod("*");
        cfg.addAllowedHeader("*");
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);
        // Exposer les en-têtes nécessaires pour la pagination
        cfg.setExposedHeaders(List.of("Content-Disposition", "X-Total-Count"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
