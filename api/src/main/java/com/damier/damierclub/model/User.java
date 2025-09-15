package com.damier.damierclub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.damier.damierclub.util.UuidGenerator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    // Authentification
    @NotBlank
    private String name; // pseudo
    
    @Email
    @Column(unique = true)
    private String email;
    
    @JsonIgnore
    private String password;

    // Profil global
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String gender;
    private String phone;
    private String address;
    private String city;
    private int rate; // classement échecs
    private Boolean active = true;

    // Relations avec les clubs via Membership
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Membership> memberships;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UuidGenerator.generateUuidV7();
        }
    }
}