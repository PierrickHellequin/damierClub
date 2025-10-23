package com.damier.damierclub.security;

import com.damier.damierclub.model.Member;
import com.damier.damierclub.repository.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class HeaderAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(HeaderAuthenticationFilter.class);
    private final MemberRepository memberRepository;

    public HeaderAuthenticationFilter(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Laisser passer les preflight CORS
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = request.getHeader("X-User-Email");
        log.debug("HeaderAuthenticationFilter - email: {}", email);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var memberOpt = memberRepository.findByEmail(email);
            if (memberOpt.isPresent()) {
                Member m = memberOpt.get();
                String role = (m.getRole() == null || m.getRole().isBlank()) ? "ROLE_USER" : m.getRole();
                String trimmedRole = role.startsWith("ROLE_") ? role.substring(5) : role;
                log.debug("Setting auth - email: {}, role: {}, trimmedRole: {}", email, role, trimmedRole);
                var auth = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(
                                new SimpleGrantedAuthority(role),
                                new SimpleGrantedAuthority(trimmedRole)
                        )
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.debug("Auth set successfully");
            } else {
                log.warn("Member not found for email: {}", email);
            }
        }
        filterChain.doFilter(request, response);
    }
}
