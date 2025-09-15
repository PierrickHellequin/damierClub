package com.damier.damierclub.controller;

import com.damier.damierclub.model.Club;
import com.damier.damierclub.repository.ClubRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubRepository clubRepository;

    public ClubController(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    @GetMapping
    public List<Club> getAllClubs(@RequestParam(name = "search", required = false) String search,
                                  @RequestParam(name = "city", required = false) String city) {
        List<Club> clubs = clubRepository.findAll();
        
        return clubs.stream()
                .filter(club -> search == null || 
                    club.getName().toLowerCase().contains(search.toLowerCase()) ||
                    (club.getDescription() != null && club.getDescription().toLowerCase().contains(search.toLowerCase())))
                .filter(club -> city == null || 
                    (club.getCity() != null && club.getCity().equalsIgnoreCase(city)))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Club getClubById(@PathVariable UUID id) {
        return clubRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Club createClub(@Valid @RequestBody Club club) {
        return clubRepository.save(club);
    }

    @PutMapping("/{id}")
    public Club updateClub(@PathVariable UUID id, @RequestBody Club clubDetails) {
        return clubRepository.findById(id)
                .map(club -> {
                    // Utilisation d'Optional pour une gestion plus élégante des champs null
                    Optional.ofNullable(clubDetails.getName()).ifPresent(club::setName);
                    Optional.ofNullable(clubDetails.getEmail()).ifPresent(club::setEmail);
                    Optional.ofNullable(clubDetails.getPhone()).ifPresent(club::setPhone);
                    Optional.ofNullable(clubDetails.getAddress()).ifPresent(club::setAddress);
                    Optional.ofNullable(clubDetails.getCity()).ifPresent(club::setCity);
                    Optional.ofNullable(clubDetails.getDescription()).ifPresent(club::setDescription);
                    Optional.ofNullable(clubDetails.getLogoUrl()).ifPresent(club::setLogoUrl);
                    Optional.ofNullable(clubDetails.getCreationDate()).ifPresent(club::setCreationDate);
                    return clubRepository.save(club);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteClub(@PathVariable UUID id) {
        clubRepository.deleteById(id);
    }

    /**
     * Recherche de clubs par ville avec Streams
     */
    @GetMapping("/by-city/{city}")
    public List<Club> getClubsByCity(@PathVariable String city) {
        return clubRepository.findAll()
                .stream()
                .filter(club -> club.getCity() != null && club.getCity().equalsIgnoreCase(city))
                .collect(Collectors.toList());
    }

    /**
     * Statistiques des clubs par ville
     */
    @GetMapping("/stats/by-city")
    public List<String> getClubStatsByCity() {
        return clubRepository.findAll()
                .stream()
                .filter(club -> club.getCity() != null)
                .collect(Collectors.groupingBy(
                    club -> club.getCity(),
                    Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry -> entry.getKey() + ": " + entry.getValue() + " club(s)")
                .sorted()
                .collect(Collectors.toList());
    }
}