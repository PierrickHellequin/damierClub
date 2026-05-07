package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** A single move in FFJD notation: square 1..50. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovePairDTO {
    private Integer from;
    private Integer to;
}
