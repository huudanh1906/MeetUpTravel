package com.meetuptravel.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "schedule_description", columnDefinition = "TEXT")
    private String scheduleDescription;

    @Column(nullable = false)
    private BigDecimal price;

    private int duration; // in days

    private String imageUrl;

    @Column(nullable = false)
    private int minPax;

    @Column(nullable = false)
    private int maxPax;

    @Column(nullable = false)
    private float rating = 0;

    @ElementCollection
    @CollectionTable(name = "tour_images", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "image_url")
    private Set<String> images = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "tour_highlights", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "highlight")
    private Set<String> highlights = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "tour_included_services", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "service_description")
    private Set<String> includedServices = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "tour_excluded_services", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "service_description")
    private Set<String> excludedServices = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "tour_pickup_points", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "pickup_point")
    private Set<String> pickupPoints = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "tour_categories", joinColumns = @JoinColumn(name = "tour_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "tour_additional_services", joinColumns = @JoinColumn(name = "tour_id"), inverseJoinColumns = @JoinColumn(name = "additional_service_id"))
    private Set<AdditionalService> additionalServices = new HashSet<>();

    private boolean featured = false;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TourPricing> pricingOptions = new HashSet<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TourReview> reviews = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "tour_guides", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "guide_language")
    private Set<String> availableGuides = new HashSet<>();

    @Column(name = "youtube_url")
    private String youtubeUrl;

    @Override
    public String toString() {
        return "Tour{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", price=" + price +
                ", duration=" + duration +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Tour))
            return false;
        Tour tour = (Tour) o;
        return id != null && id.equals(tour.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}