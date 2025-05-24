package com.meetuptravel.backend.dto;

import com.meetuptravel.backend.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private User.Role role;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public UserDTO(Long id, String email, String fullName, String phoneNumber, User.Role role) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }
}