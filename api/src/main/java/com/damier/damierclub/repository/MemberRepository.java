package com.damier.damierclub.repository;

import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
    Optional<Member> findByEmail(String email);
    
    // Recherche par club - utiliser la relation 'club' au lieu de 'clubId'
    List<Member> findByClub(Club club);
    Page<Member> findByClub(Club club, Pageable pageable);
    
    // Alternative avec ID du club via une requête personnalisée
    List<Member> findByClub_Id(UUID clubId);
    Page<Member> findByClub_Id(UUID clubId, Pageable pageable);
    
    // Recherche par rôle dans le club
    List<Member> findByClubRole(String clubRole);
    List<Member> findByClubAndClubRole(Club club, String clubRole);
}