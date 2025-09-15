package com.damier.damierclub.controller;

import com.damier.damierclub.model.Member;
import com.damier.damierclub.service.MemberService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final MemberService memberService;
    private final String syncToken;

    public AuthController(MemberService memberService, @Value("${auth.sync.token}") String syncToken) {
        this.memberService = memberService;
        this.syncToken = syncToken;
    }

    // Requête envoyée par le front (better-auth) après création / mise à jour utilisateur
    public record SyncRequest(@Email String email, @NotBlank String name) {}
    public record MemberDto(UUID id, String name, String email, String role) {
        static MemberDto from(Member m){ return new MemberDto(m.getId(), m.getName(), m.getEmail(), m.getRole()); }
    }

    @PostMapping("/sync")
    public ResponseEntity<MemberDto> sync(@RequestHeader("X-Auth-Sync-Token") String providedToken,
                                          @RequestBody SyncRequest req) {
        if (!syncToken.equals(providedToken)) {
            return ResponseEntity.status(403).build();
        }
        // Chercher membre existant
        var existingOpt = memberService.findByEmail(req.email());
        Member member;
        if (existingOpt.isPresent()) {
            member = existingOpt.get();
            member.setName(req.name());
            member = memberService.update(member, member); // update name only
        } else {
            // Créer un nouveau membre avec mot de passe aléatoire (non utilisé côté Java directement)
            member = new Member();
            member.setEmail(req.email());
            member.setName(req.name());
            member.setPassword(UUID.randomUUID().toString());
            member = memberService.create(member);
        }
        return ResponseEntity.ok(MemberDto.from(member));
    }
}
