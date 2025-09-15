package com.damier.damierclub.controller;

import com.damier.damierclub.model.Member;
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

    public InternalAuthController(MemberService memberService) {
        this.memberService = memberService;
    }

    public record RegisterRequest(@NotBlank String name, @Email String email, @NotBlank String password) {}
    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record MemberDto(UUID id, String name, String email, String role) {
        static MemberDto from(Member m){ return new MemberDto(m.getId(), m.getName(), m.getEmail(), m.getRole()); }
    }

    @PostMapping("/register")
    public ResponseEntity<MemberDto> register(@Valid @RequestBody RegisterRequest req) {
        if (memberService.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.status(409).build();
        }
        Member created = memberService.register(req.name(), req.email(), req.password());
        return ResponseEntity.ok(MemberDto.from(created));
    }

    @PostMapping("/login")
    public ResponseEntity<MemberDto> login(@Valid @RequestBody LoginRequest req) {
        return memberService.authenticate(req.email(), req.password())
                .map(m -> ResponseEntity.ok(MemberDto.from(m)))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}
