package com.damier.damierclub.security;

import com.damier.damierclub.model.Member;
import com.damier.damierclub.repository.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Authentification stateless par JWT (en-tête "Authorization: Bearer <token>").
 * Remplace l'ancien HeaderAuthenticationFilter basé sur X-User-Email,
 * qui permettait de se faire passer pour n'importe quel utilisateur.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final MemberRepository memberRepository;

    public JwtAuthenticationFilter(JwtService jwtService, MemberRepository memberRepository) {
        this.jwtService = jwtService;
        this.memberRepository = memberRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = authHeader.substring(BEARER_PREFIX.length());
            jwtService.parseToken(token).ifPresent(claims -> {
                String email = claims.getSubject();
                // Recharge le membre : rôle à jour et compte toujours existant
                Optional<Member> memberOpt = memberRepository.findByEmail(email);
                if (memberOpt.isPresent()) {
                    Member m = memberOpt.get();
                    String role = (m.getRole() == null || m.getRole().isBlank()) ? "ROLE_USER" : m.getRole();
                    String trimmedRole = role.startsWith("ROLE_") ? role.substring(5) : role;
                    var auth = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority(role), new SimpleGrantedAuthority(trimmedRole))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            });
        }
        filterChain.doFilter(request, response);
    }
}
