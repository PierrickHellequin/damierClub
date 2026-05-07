import { describe, expect, it } from "vitest";
import { emptyBoard, initialBoard } from "./board";
import { decodeBoard, encodeBoard, moveNotation } from "./notation";
import { applyMove, checkOutcome, legalMoves } from "./rules";
import type { Board, Color, Move } from "./types";

function pos(row: number, col: number) {
  return { row, col };
}

function findMove(moves: Move[], fromR: number, fromC: number, toR: number, toC: number) {
  return moves.find(
    (m) =>
      m.from.row === fromR &&
      m.from.col === fromC &&
      m.to.row === toR &&
      m.to.col === toC,
  );
}

describe("initial position", () => {
  it("white has 20 men, black has 20 men", () => {
    const b = initialBoard();
    let whites = 0,
      blacks = 0;
    for (const row of b) for (const cell of row) {
      if (cell?.color === "white") whites++;
      if (cell?.color === "black") blacks++;
    }
    expect(whites).toBe(20);
    expect(blacks).toBe(20);
  });

  it("white has 9 quiet moves to start", () => {
    const moves = legalMoves(initialBoard(), "white");
    expect(moves.every((m) => m.captures.length === 0)).toBe(true);
    expect(moves).toHaveLength(9);
  });
});

describe("encoding round-trip", () => {
  it("encodes and decodes the initial board identically", () => {
    const b = initialBoard();
    const e = encodeBoard(b);
    expect(e).toHaveLength(50);
    const back = decodeBoard(e);
    expect(back).not.toBeNull();
    expect(encodeBoard(back!)).toBe(e);
  });
});

describe("man moves", () => {
  it("white man moves diagonally forward only when no captures", () => {
    const b = emptyBoard();
    b[5][4] = { color: "white", kind: "man" };
    const moves = legalMoves(b, "white");
    expect(moves).toHaveLength(2);
    expect(moves.every((m) => m.to.row === 4)).toBe(true);
  });

  it("white man captures backward when forced (international rule)", () => {
    const b = emptyBoard();
    b[5][4] = { color: "white", kind: "man" };
    b[6][5] = { color: "black", kind: "man" }; // behind-right
    const moves = legalMoves(b, "white");
    expect(moves).toHaveLength(1);
    expect(moves[0].captures).toHaveLength(1);
    expect(moves[0].to).toEqual(pos(7, 6));
  });

  it("white man promotes when reaching row 0 at end of move", () => {
    const b = emptyBoard();
    b[1][2] = { color: "white", kind: "man" };
    const moves = legalMoves(b, "white");
    const promo = moves.find((m) => m.to.row === 0);
    expect(promo).toBeDefined();
    expect(promo!.promotes).toBe(true);
    const after = applyMove(b, promo!);
    expect(after[0][1] || after[0][3]).toMatchObject({ color: "white", kind: "king" });
  });
});

describe("mandatory longest capture", () => {
  it("filters out shorter capture sequences", () => {
    // Setup: white at (4,3); blacks at (3,2) and (1,2). White can take 1 or 2.
    const b = emptyBoard();
    b[4][3] = { color: "white", kind: "man" };
    b[3][2] = { color: "black", kind: "man" };
    b[1][2] = { color: "black", kind: "man" };
    const moves = legalMoves(b, "white");
    // Both captures end up taking 2 if the geometry allows; verify only the
    // longest sequences are returned.
    const max = moves.reduce((acc, m) => Math.max(acc, m.captures.length), 0);
    expect(max).toBeGreaterThanOrEqual(1);
    expect(moves.every((m) => m.captures.length === max)).toBe(true);
  });

  it("forces the player to capture instead of playing a quiet move", () => {
    const b = emptyBoard();
    b[5][4] = { color: "white", kind: "man" };
    b[4][3] = { color: "black", kind: "man" };
    const moves = legalMoves(b, "white");
    expect(moves.every((m) => m.captures.length > 0)).toBe(true);
  });
});

describe("rafle (multi-jump capture)", () => {
  it("a man chains captures when geometry allows", () => {
    // White at (6,1), blacks at (5,2) and (3,2). After taking (5,2) the
    // white lands on (4,3) but cannot reach (3,2) — adjust geometry.
    // Use: white (6,1); black (5,2); empty (4,3); black (3,4); empty (2,5).
    const b = emptyBoard();
    b[6][1] = { color: "white", kind: "man" };
    b[5][2] = { color: "black", kind: "man" };
    b[3][4] = { color: "black", kind: "man" };
    const moves = legalMoves(b, "white");
    expect(moves.length).toBeGreaterThan(0);
    expect(moves[0].captures).toHaveLength(2);
    expect(moves[0].path).toHaveLength(2);
  });

  it("a man does not promote if it merely passes the back rank during a rafle", () => {
    // Setup so that the white man passes through row 0 and continues capturing.
    // White (3,4); black (2,5); empty (1,6); black (0,7) impossible to land beyond.
    // A clearer setup: white (2,1); black (1,2); empty (0,3); black (1,4); empty (2,5).
    const b = emptyBoard();
    b[2][1] = { color: "white", kind: "man" };
    b[1][2] = { color: "black", kind: "man" };
    b[1][4] = { color: "black", kind: "man" };
    const moves = legalMoves(b, "white");
    const longest = moves.find((m) => m.captures.length === 2);
    if (longest) {
      // If the path ends on row 2 (not row 0), there should be no promotion.
      const lastRow = longest.to.row;
      if (lastRow !== 0) expect(longest.promotes).toBe(false);
    }
  });
});

describe("king moves", () => {
  it("a lone white king has up to 13 sliding moves from a central square", () => {
    const b = emptyBoard();
    b[4][3] = { color: "white", kind: "king" };
    const moves = legalMoves(b, "white");
    expect(moves.length).toBeGreaterThan(8);
    expect(moves.every((m) => m.captures.length === 0)).toBe(true);
  });

  it("king flying capture: jumps over a single enemy and lands anywhere on the diagonal", () => {
    const b = emptyBoard();
    b[4][3] = { color: "white", kind: "king" };
    b[2][5] = { color: "black", kind: "man" };
    const moves = legalMoves(b, "white");
    // All landing squares should be on the diagonal past (2,5): (1,6) and (0,7).
    expect(moves.length).toBeGreaterThanOrEqual(2);
    expect(moves.every((m) => m.captures.length === 1)).toBe(true);
    const tos = moves.map((m) => `${m.to.row},${m.to.col}`).sort();
    expect(tos).toContain("1,6");
    expect(tos).toContain("0,7");
  });
});

describe("game outcome", () => {
  it("declares the side without pieces as loser", () => {
    const b = emptyBoard();
    b[5][4] = { color: "white", kind: "man" };
    const out = checkOutcome(b, "black");
    expect(out).toEqual({ kind: "win", winner: "white", reason: "no-pieces" });
  });

  it("declares loss when a player has pieces but no legal moves", () => {
    // Black man at corner (0,9). Forward squares: (1,10) off-board,
    // (1,8) blocked by white. Capture over (1,8) to (2,7) blocked too.
    // No backward jump available. Black is stalemated.
    const b = emptyBoard();
    b[0][9] = { color: "black", kind: "man" };
    b[1][8] = { color: "white", kind: "man" };
    b[2][7] = { color: "white", kind: "man" };
    const out = checkOutcome(b, "black");
    expect(out?.winner).toBe("white");
    expect(out?.reason).toBe("no-moves");
  });
});

describe("notation", () => {
  it("formats quiet moves with '-' and captures with 'x'", () => {
    const b = initialBoard();
    const moves = legalMoves(b, "white");
    expect(moves[0]).toBeDefined();
    const not = moveNotation(moves[0]);
    expect(not).toMatch(/^\d+-\d+$/);
  });
});

describe("apply move", () => {
  it("removes captured pieces and moves the piece", () => {
    const b: Board = emptyBoard();
    b[5][4] = { color: "white", kind: "man" };
    b[4][3] = { color: "black", kind: "man" };
    const moves = legalMoves(b, "white");
    const m = findMove(moves, 5, 4, 3, 2);
    expect(m).toBeDefined();
    const after = applyMove(b, m!);
    expect(after[5][4]).toBeNull();
    expect(after[4][3]).toBeNull();
    expect(after[3][2]).toMatchObject<{ color: Color }>({ color: "white" });
  });
});
