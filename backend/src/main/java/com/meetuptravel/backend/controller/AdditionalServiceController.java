package com.meetuptravel.backend.controller;

import com.meetuptravel.backend.dto.AdditionalServiceDTO;
import com.meetuptravel.backend.model.AdditionalService;
import com.meetuptravel.backend.repository.AdditionalServiceRepository;
import com.meetuptravel.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/additional-services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdditionalServiceController {

    private final AdditionalServiceRepository additionalServiceRepository;

    @GetMapping
    public ResponseEntity<List<AdditionalServiceDTO>> getAllAdditionalServices() {
        List<AdditionalServiceDTO> services = additionalServiceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdditionalServiceDTO> getAdditionalServiceById(@PathVariable Long id) {
        AdditionalService service = additionalServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Additional service not found with id: " + id));
        return ResponseEntity.ok(convertToDTO(service));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdditionalServiceDTO> createAdditionalService(@RequestBody AdditionalServiceDTO serviceDTO) {
        // Check if name already exists
        if (additionalServiceRepository.existsByName(serviceDTO.getName())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        AdditionalService service = convertToEntity(serviceDTO);
        AdditionalService savedService = additionalServiceRepository.save(service);
        return new ResponseEntity<>(convertToDTO(savedService), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdditionalServiceDTO> updateAdditionalService(@PathVariable Long id,
            @RequestBody AdditionalServiceDTO serviceDTO) {
        AdditionalService existingService = additionalServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Additional service not found with id: " + id));

        // Check if name changed and already exists
        if (!existingService.getName().equals(serviceDTO.getName()) &&
                additionalServiceRepository.existsByName(serviceDTO.getName())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        existingService.setName(serviceDTO.getName());
        existingService.setDescription(serviceDTO.getDescription());
        existingService.setPrice(serviceDTO.getPrice());
        existingService.setPriceUnit(serviceDTO.getPriceUnit());

        AdditionalService updatedService = additionalServiceRepository.save(existingService);
        return ResponseEntity.ok(convertToDTO(updatedService));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAdditionalService(@PathVariable Long id) {
        if (!additionalServiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Additional service not found with id: " + id);
        }

        additionalServiceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/debug")
    public ResponseEntity<List<Map<String, Object>>> debugAllServices() {
        List<Map<String, Object>> servicesDebug = additionalServiceRepository.findAll().stream()
                .map(service -> Map.of(
                        "id", service.getId(),
                        "name", service.getName(),
                        "description", service.getDescription() != null ? service.getDescription() : "",
                        "price", service.getPrice(),
                        "priceUnit", service.getPriceUnit(),
                        "toursCount", service.getTours() != null ? service.getTours().size() : 0,
                        "tourIds", service.getTours() != null ? service.getTours().stream()
                                .map(t -> t.getId())
                                .collect(Collectors.toList()) : List.of()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(servicesDebug);
    }

    private AdditionalServiceDTO convertToDTO(AdditionalService service) {
        AdditionalServiceDTO dto = new AdditionalServiceDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setPriceUnit(service.getPriceUnit());
        return dto;
    }

    private AdditionalService convertToEntity(AdditionalServiceDTO dto) {
        AdditionalService service = new AdditionalService();
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());
        service.setPriceUnit(dto.getPriceUnit());
        return service;
    }
}