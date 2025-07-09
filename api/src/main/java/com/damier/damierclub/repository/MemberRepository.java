package com.damier.damierclub.repository;

import com.damier.damierclub.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find a member by email:
    Member findByEmail(String email);
    
    // You can also add methods for other queries as needed
}