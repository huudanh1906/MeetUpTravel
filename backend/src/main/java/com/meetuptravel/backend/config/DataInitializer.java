package com.meetuptravel.backend.config;

import com.meetuptravel.backend.model.Category;
import com.meetuptravel.backend.model.Tour;
import com.meetuptravel.backend.repository.CategoryRepository;
import com.meetuptravel.backend.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
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

    @Override
    public void run(String... args) {
        log.info("Starting data initialization check...");

        // Create categories if they don't exist
        createCategoriesIfNotExist();

        // Log the current tour count before checking
        long tourCount = tourRepository.count();
        log.info("Current tour count in database: {}", tourCount);

        // Create real tours if none exist
        if (tourCount == 0) {
            log.info("No tours found in database. Creating real tours...");
            createRealTours();
        } else {
            log.info("Tours already exist in database. Skipping data creation.");
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
                log.info("Created category: {}", name);
            }
        }
    }

    private void createRealTours() {
        // Get categories
        Category culture = categoryRepository.findByName("Culture").orElseThrow();
        Category adventure = categoryRepository.findByName("Adventure").orElseThrow();
        Category foodTour = categoryRepository.findByName("Food tour").orElseThrow();
        Category nature = categoryRepository.findByName("Nature").orElseThrow();

        // Create tour 1 - FAST TRACK SERVICE
        Tour fastTrack = new Tour();
        fastTrack.setTitle("FAST TRACK SERVICE - Note your flight detail when booking");
        fastTrack.setDescription(
                "<p><strong>Fast-Track service</strong>&nbsp;helps you save time by avoiding the endless lines, especially during rush hours at the visa and custom counter Skip long lines, and receive assistance at checkpoints. Get assistance with any Visa or Immigration and Customs procedures When arriving, our representative will welcome and help you with all the post-flight procedures (for arrival flights).</p>");
        fastTrack.setScheduleDescription(
                "\"<p class='\"schedule-section-title'\"' data-section-title='\"Process: FAST TRACK'\"'><strong>Process: FAST TRACK</strong></p><p>Meetup Travel's VIP Fast-Track Service, available at&nbsp;<strong>Tan Son Nhat, Noi Bai, Da Nang, and Phu Quoc International Airports, will make your Vietnam trip stress-free</strong>. You can skip long immigration lines and breeze through the Priority Immigration Lane for a smooth, hassle-free experience.</p>\"");
        fastTrack.setPrice(new BigDecimal("30.00"));
        fastTrack.setDuration(0);
        fastTrack.setImageUrl("https://cdn.meetup.travel/dich-vu-don-tien-khach-fast-track.jpg");
        fastTrack.setMinPax(1);
        fastTrack.setMaxPax(100);
        fastTrack.setRating(4.9f);
        fastTrack.setCategories(new HashSet<>(Arrays.asList(culture, adventure)));
        fastTrack.setAvailableGuides(new HashSet<>(Arrays.asList("English", "Vietnamese")));
        Tour savedFastTrack = tourRepository.save(fastTrack);
        log.info("Created real tour: {}", savedFastTrack.getTitle());

        // Create tour 2 - Hanoi-Sapa Sleeper Bus
        Tour hanoiSapa = new Tour();
        hanoiSapa.setTitle("Hanoi - Sapa Sleeper Bus by HK Buslines");
        hanoiSapa.setDescription(
                "<p><strong>Your Comfortable Journey to Sapa Starts Here!</strong></p><p>Looking for a&nbsp;<strong>relaxing and hassle-free</strong>&nbsp;way to travel from&nbsp;<strong>Hanoi to Sapa</strong>? With&nbsp;<strong>HK Buslines</strong>, you can enjoy a smooth and comfortable journey featuring:</p>");
        hanoiSapa.setScheduleDescription(
                "<p class='\"schedule-section-title'\"' data-section-title='\"Luxury Sleeper Bus from Hanoi to Sapa: Luxury Sleeper Bus from Hanoi to Sapa'\"'><strong>Luxury Sleeper Bus from Hanoi to Sapa: Luxury Sleeper Bus from Hanoi to Sapa</strong></p><p><strong>Duration: 6 hours - 7 hours (exclude pick up/drop off duration ~ 1 hour)</strong></p>");
        hanoiSapa.setPrice(new BigDecimal("19.00"));
        hanoiSapa.setDuration(0);
        hanoiSapa.setImageUrl("https://cdn.meetup.travel/z5899367009674-85fa7fd28783caac6742381bfa54d4bc.jpg");
        hanoiSapa.setMinPax(1);
        hanoiSapa.setMaxPax(40);
        hanoiSapa.setRating(4.9f);
        hanoiSapa.setCategories(new HashSet<>(Arrays.asList(adventure, nature)));
        hanoiSapa.setAvailableGuides(new HashSet<>(Arrays.asList("English")));
        hanoiSapa.setYoutubeUrl("https://www.youtube.com/watch?v=uLwiRxle0UM");
        Tour savedHanoiSapa = tourRepository.save(hanoiSapa);
        log.info("Created real tour: {}", savedHanoiSapa.getTitle());

        // Create tour 3 - Cu Chi Tunnels
        Tour cuChi = new Tour();
        cuChi.setTitle("Cu Chi Tunnels Half-day Tour");
        cuChi.setDescription(
                "<p>Discover Cu Chi Tunnels with an informative tour guide. Go underground to explore the tunnel system, walk around the forest, and try your hand at the shooting range.</p>");
        cuChi.setScheduleDescription(
                "<p class='\"schedule-section-title'\"' data-section-title='\"Itinerary: Cu Chi Tunnels Half-day Tour'\"'><strong>Itinerary: Cu Chi Tunnels Half-day Tour</strong></p><p><strong>Morning Tour:</strong>&nbsp;07:30 AM – 1:30 PM</p><p><strong>Afternoon Tour:</strong>&nbsp;12:30 PM – 6:30 PM</p>");
        cuChi.setPrice(new BigDecimal("28.00"));
        cuChi.setDuration(1);
        cuChi.setImageUrl("https://cdn.meetup.travel/172230763351598.jpg");
        cuChi.setMinPax(8);
        cuChi.setMaxPax(20);
        cuChi.setRating(4.9f);
        cuChi.setFeatured(true);
        cuChi.setCategories(new HashSet<>(Arrays.asList(culture, adventure)));
        cuChi.setAvailableGuides(new HashSet<>(Arrays.asList("Vietnamese", "English")));
        cuChi.setYoutubeUrl("https://www.youtube.com/watch?v=uDE8fSmW5lU");
        Tour savedCuChi = tourRepository.save(cuChi);
        log.info("Created real tour: {}", savedCuChi.getTitle());

        // Create tour 4 - Incense Village
        Tour incense = new Tour();
        incense.setTitle("Incense Village & Hat Making Village in Hanoi Half Day Tour");
        incense.setDescription(
                "<p>Immerse yourself in Vietnam's rich artisanal heritage with this&nbsp;<strong>half-day cultural tour</strong>. Journey to&nbsp;<strong>Chuong Village</strong>, home to a 300-year-old conical hat-making tradition, where you'll meet skilled artisans and witness their meticulous craftsmanship.</p>");
        incense.setScheduleDescription(
                "<p class='\"schedule-section-title'\"' data-section-title='\" Itinerary: Itinerary'\"'><strong> Itinerary: Itinerary</strong></p><p><strong>&nbsp;7:30 - 8:00 AM (Morning) | 12:00 - 12:30 PM (Afternoon)</strong></p>");
        incense.setPrice(new BigDecimal("32.00"));
        incense.setDuration(1);
        incense.setImageUrl("https://cdn.meetup.travel/146.jpg");
        incense.setMinPax(8);
        incense.setMaxPax(15);
        incense.setRating(4.7f);
        incense.setFeatured(true);
        incense.setCategories(new HashSet<>(Arrays.asList(culture, nature)));
        incense.setAvailableGuides(new HashSet<>(Arrays.asList("Vietnamese", "English")));
        incense.setYoutubeUrl("https://www.youtube.com/watch?v=LC2Ikgzfb80");
        Tour savedIncense = tourRepository.save(incense);
        log.info("Created real tour: {}", savedIncense.getTitle());

        log.info("Real tour data creation complete.");
    }
}