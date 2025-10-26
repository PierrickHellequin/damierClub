package com.damier.damierclub.dto;

import com.damier.damierclub.model.GameResult;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameDTO {
    private String opponentName;
    private Integer opponentPoints;
    private GameResult result; // WIN, LOSS, DRAW
    private String score; // ex: "2-0", "1-1", "0-2"
}
