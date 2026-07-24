package com.damier.damierclub.controller;

import com.damier.damierclub.model.Member;
import com.damier.damierclub.security.JwtService;
import com.damier.damierclub.service.MemberService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/internal")
public class InternalAuthController {

    private final MemberService memberService;
    private final JwtService jwtService;

    public InternalAuthController(MemberService memberService, JwtService jwtService) {
        this.memberService = memberService;
        this.jwtService = jwtService;
    }

    public record RegisterRequest(@NotBlank String name, @Email String email, @NotBlank String password) {}
    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record ClubRef(UUID id) {}
    public record MemberDto(UUID id, String name, String email, String role, UUID clubId, ClubRef club, String clubRole) {
        static MemberDto from(Member m){
            UUID clubId = m.getClub() != null ? m.getClub().getId() : null;
            ClubRef club = m.getClub() != null ? new ClubRef(m.getClub().getId()) : null;
            String clubRole = m.getClubRole() != null ? m.getClubRole().name() : null;
            return new MemberDto(m.getId(), m.getName(), m.getEmail(), m.getRole(), clubId, club, clubRole);
        }
    }

    public record AuthResponse(String token, MemberDto user) {}

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        if (memberService.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.status(409).build();
        }
        Member created = memberService.register(req.name(), req.email(), req.password());
        String token = jwtService.issueToken(created.getEmail(), created.getRole());
        return ResponseEntity.ok(new AuthResponse(token, MemberDto.from(created)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return memberService.authenticate(req.email(), req.password())
                .map(m -> ResponseEntity.ok(
                        new AuthResponse(jwtService.issueToken(m.getEmail(), m.getRole()), MemberDto.from(m))))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}
