package com.damier.damierclub.mapper;

import com.damier.damierclub.dto.MemberDTO;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.Club;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class MemberMapper {

    @Autowired
    protected com.damier.damierclub.repository.ClubRepository clubRepository;

    @Mapping(source = "club.id", target = "club.id")
    @Mapping(source = "club.name", target = "clubName")
    public abstract MemberDTO toDTO(Member member);

    @Mapping(target = "club", source = "club", qualifiedByName = "mapClubFromDTO")
    @Mapping(target = "password", ignore = true) // Ne pas écraser le mot de passe existant
    public abstract void updateEntityFromDTO(MemberDTO dto, @MappingTarget Member member);

    @Mapping(target = "club", source = "club", qualifiedByName = "mapClubFromDTO")
    @Mapping(target = "id", ignore = true) // L'ID sera généré automatiquement
    public abstract Member createEntityFromDTO(MemberDTO dto);

    @Named("mapClubFromDTO")
    protected Club mapClubFromDTO(MemberDTO.ClubReference clubRef) {
        if (clubRef == null || clubRef.getId() == null) {
            return null;
        }
        return clubRepository.findById(clubRef.getId()).orElse(null);
    }
}