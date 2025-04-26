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
@Table(name = "additional_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false, name = "price_unit")
    private String priceUnit; // per person, per car, per sim, etc.

    @ManyToMany(mappedBy = "additionalServices")
    private Set<Tour> tours = new HashSet<>();

    @Override
    public String toString() {
        return "AdditionalService{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", priceUnit='" + priceUnit + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof AdditionalService))
            return false;
        AdditionalService that = (AdditionalService) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}