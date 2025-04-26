package com.meetuptravel.backend.service;

import com.meetuptravel.backend.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserDTO> findAll(Pageable pageable);

    UserDTO findById(Long id);

    UserDTO getCurrentUserProfile();
}