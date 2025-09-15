package com.damier.damierclub.security;

import com.damier.damierclub.model.Member;
import com.damier.damierclub.repository.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
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

    private final MemberRepository memberRepository;

    @Value("${auth.hmac.secret}")
    private String hmacSecret;

    private static final long ALLOWED_SKEW_SECONDS = 300; // 5 min

    public HeaderAuthenticationFilter(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    private boolean validSignature(String email, String ts, String providedSig) {
        if (email == null || ts == null || providedSig == null) return false;
        try {
            long timestamp = Long.parseLong(ts);
            long now = System.currentTimeMillis() / 1000L;
            if (Math.abs(now - timestamp) > ALLOWED_SKEW_SECONDS) return false;
            String payload = email + ":" + ts;
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            mac.init(new javax.crypto.spec.SecretKeySpec(hmacSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(payload.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) sb.append(String.format("%02x", b));
            String expected = sb.toString();
            return org.springframework.util.StringUtils.hasText(providedSig) && providedSig.equalsIgnoreCase(expected);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Laisser passer les preflight CORS
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        String email = request.getHeader("X-User-Email");
        String ts = request.getHeader("X-Auth-Timestamp");
        String sig = request.getHeader("X-Auth-Signature");
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (validSignature(email, ts, sig)) {
                Member m = memberRepository.findByEmail(email);
                if (m != null) {
                    var auth = new UsernamePasswordAuthenticationToken(email, null, List.of(new SimpleGrantedAuthority(m.getRole())));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
