package com.meetuptravel.backend.config;

import com.meetuptravel.backend.model.Category;
import com.meetuptravel.backend.model.Tour;
import com.meetuptravel.backend.model.User;
import com.meetuptravel.backend.repository.CategoryRepository;
import com.meetuptravel.backend.repository.TourRepository;
import com.meetuptravel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create categories if they don't exist
        createCategoriesIfNotExist();

        // Create sample tours if they don't exist
        if (tourRepository.count() == 0) {
            createSampleTours();
        }

        if (userRepository.count() == 0 || !userRepository.existsByRole(User.Role.ADMIN)) {
            createDefaultAdminUser();
        }
    }

    private void createCategoriesIfNotExist() {
        String[] categoryNames = { "Culture", "Adventure", "Food tour", "Diving", "Motorbike",
                "Trekking", "Paragliding", "Surf", "Nature", "Bicycle", "Luxury", "Cruise", "Walking" };

        for (String name : categoryNames) {
            if (!categoryRepository.existsByName(name)) {
                Category category = new Category();
                category.setName(name);
                category.setDescription(name + " tours and activities");
                categoryRepository.save(category);
            }
        }
    }

    private void createSampleTours() {
        // Get categories
        Category culture = categoryRepository.findByName("Culture").orElseThrow();
        Category adventure = categoryRepository.findByName("Adventure").orElseThrow();
        Category foodTour = categoryRepository.findByName("Food tour").orElseThrow();
        Category nature = categoryRepository.findByName("Nature").orElseThrow();

        // Create tour 1
        Tour hanoiSapa = new Tour();
        hanoiSapa.setTitle("Hanoi - Sapa Sleeper Bus by HK Buslines");
        hanoiSapa.setDescription("Experience comfortable travel from Hanoi to Sapa on our sleeper bus service.");
        hanoiSapa.setPrice(new BigDecimal("19.00"));
        hanoiSapa.setDuration(0);
        hanoiSapa.setImageUrl("https://example.com/images/hanoi-sapa-bus.jpg");
        hanoiSapa.setMinPax(1);
        hanoiSapa.setMaxPax(40);
        hanoiSapa.setRating(4.9f);
        hanoiSapa.setCategories(new HashSet<>(Arrays.asList(adventure, nature)));
        hanoiSapa.setAvailableGuides(new HashSet<>(Arrays.asList("English tour guide")));
        tourRepository.save(hanoiSapa);

        // Create tour 2
        Tour cuChi = new Tour();
        cuChi.setTitle("Cu Chi Tunnels Half-day Tour");
        cuChi.setDescription("Explore the historic Cu Chi tunnels on this guided half-day tour.");
        cuChi.setPrice(new BigDecimal("28.00"));
        cuChi.setDuration(1);
        cuChi.setImageUrl("https://example.com/images/cu-chi-tunnels.jpg");
        cuChi.setMinPax(8);
        cuChi.setMaxPax(20);
        cuChi.setRating(4.9f);
        cuChi.setFeatured(true);
        cuChi.setCategories(new HashSet<>(Arrays.asList(culture, adventure)));
        cuChi.setAvailableGuides(new HashSet<>(Arrays.asList("Vietnamese tour guide", "English tour guide")));
        tourRepository.save(cuChi);

        // Create tour 3
        Tour hanoiFood = new Tour();
        hanoiFood.setTitle("HANOI FOOD TOUR BY MOTORBIKE");
        hanoiFood.setDescription("Taste the best local cuisine in Hanoi on this exciting motorbike food tour.");
        hanoiFood.setPrice(new BigDecimal("59.00"));
        hanoiFood.setDuration(1);
        hanoiFood.setImageUrl("https://example.com/images/hanoi-food-tour.jpg");
        hanoiFood.setMinPax(1);
        hanoiFood.setMaxPax(10);
        hanoiFood.setRating(4.6f);
        hanoiFood.setFeatured(true);
        hanoiFood.setCategories(new HashSet<>(Arrays.asList(foodTour)));
        hanoiFood.setAvailableGuides(new HashSet<>(Arrays.asList("Vietnamese tour guide", "English tour guide")));
        tourRepository.save(hanoiFood);
    }

    private void createDefaultAdminUser() {
        log.info("Creating default admin user");

        User adminUser = new User();
        adminUser.setEmail("admin@meetuptravel.com");
        adminUser.setPassword(passwordEncoder.encode("Admin@123"));
        adminUser.setFullName("Admin User");
        adminUser.setPhoneNumber("+84123456789");
        adminUser.setRole(User.Role.ADMIN);

        userRepository.save(adminUser);

        log.info("Default admin user created");
    }
}