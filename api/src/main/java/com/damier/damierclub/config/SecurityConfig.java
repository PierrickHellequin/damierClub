package com.damier.damierclub.config;

import com.damier.damierclub.security.HeaderAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
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

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final HeaderAuthenticationFilter headerAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3009,http://127.0.0.1:3009}")
    private String allowedOriginsCsv;

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
                // Public site API: read-only, never exposes drafts or private data
                .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                // Swagger / OpenAPI
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // BO endpoints - currently open in GET to keep the existing BO working;
                // tighten to authenticated() once the BO uses /api/public for read paths.
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
        List<String> origins = Arrays.stream(allowedOriginsCsv.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .toList();
        cfg.setAllowedOrigins(origins);
        cfg.addAllowedMethod("*");
        cfg.addAllowedHeader("*");
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);
        cfg.setExposedHeaders(List.of("Content-Disposition", "X-Total-Count"));

        // Public API: looser CORS so any front (incl. previews) can fetch read-only data.
        CorsConfiguration publicCfg = new CorsConfiguration();
        publicCfg.setAllowedOriginPatterns(List.of("*"));
        publicCfg.setAllowedMethods(List.of("GET", "OPTIONS", "HEAD"));
        publicCfg.addAllowedHeader("*");
        publicCfg.setAllowCredentials(false);
        publicCfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/public/**", publicCfg);
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
