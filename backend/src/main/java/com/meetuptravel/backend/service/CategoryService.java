package com.meetuptravel.backend.service;

import com.meetuptravel.backend.dto.CategoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {

    CategoryDTO getCategoryById(Long id);

    CategoryDTO getCategoryByName(String name);

    Page<CategoryDTO> getAllCategories(Pageable pageable);

    List<CategoryDTO> getAllCategories();

    CategoryDTO createCategory(CategoryDTO categoryDTO);

    CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO);

    void deleteCategory(Long id);

    boolean existsByName(String name);
}