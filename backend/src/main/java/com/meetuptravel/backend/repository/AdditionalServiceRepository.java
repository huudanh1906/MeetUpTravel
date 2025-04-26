package com.meetuptravel.backend.repository;

import com.meetuptravel.backend.model.AdditionalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdditionalServiceRepository extends JpaRepository<AdditionalService, Long> {
    Optional<AdditionalService> findByName(String name);

    boolean existsByName(String name);
}