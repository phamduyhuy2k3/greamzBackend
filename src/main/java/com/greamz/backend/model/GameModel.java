package com.greamz.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.greamz.backend.common.TimeStampEntity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GameModel extends TimeStampEntity {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @JsonProperty("appid")
    private Long appid;
    @JsonProperty("name")
    private String name;
    @Column(length = 100000)
    private String detailed_description;
    @Column(length = 100000)
    private String about_the_game;
    @Column(length = 100000)
    private String short_description;
    @Column(length = 1000)
    private String header_image;
    @Column(length = 1000)
    private String website;
    @Column(length = 1000)
    private String capsule_image;
    private Integer stock;
    private Double price;
    private Integer discount;
    @Transient
    private Integer quantity;
    @ElementCollection()
    private Set<String> images;
    @ElementCollection()

    private Set<String> movies;
    @ManyToMany(fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JoinTable(name = "game_category",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;
    @ElementCollection(fetch = FetchType.LAZY)

    private List<String> supported_languages;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Platform platform;
    @OneToMany(mappedBy = "game")
    private List<Review> reviews;


}
