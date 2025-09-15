package com.damier.damierclub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.damier.damierclub.util.UuidGenerator;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "clubs")
public class Club {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;

    @Column(name= "creation_date")
    private LocalDate creationDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    // Relation OneToMany : un club a plusieurs membres
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    @JsonIgnore // Ignorer la liste des membres pour éviter la récursion
    private List<Member> members;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UuidGenerator.generateUuidV7();
        }
    }
}