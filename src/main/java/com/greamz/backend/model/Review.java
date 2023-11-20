package com.greamz.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.greamz.backend.common.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Review extends TimeStampEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    private int rating;
    private int likes;
    private int dislikes;
    @ManyToOne
    private AccountModel account;
    @ManyToOne
    private GameModel game;
}
