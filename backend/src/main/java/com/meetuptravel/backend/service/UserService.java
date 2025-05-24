package com.meetuptravel.backend.service;

import com.meetuptravel.backend.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserDTO> findAll(Pageable pageable);

    UserDTO findById(Long id);

    UserDTO getCurrentUserProfile();

    UserDTO createUser(UserDTO userDTO);

    UserDTO updateUser(Long id, UserDTO userDTO);

    UserDTO updatePassword(Long id, String newPassword);

    void deleteUser(Long id);
}