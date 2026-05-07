import { describe, expect, it } from "vitest";
import { initialBoard, emptyBoard } from "./board";
import { evaluate, pickMove } from "./ai";

describe("evaluation", () => {
  it("returns 0 on the symmetrical opening position", () => {
    expect(evaluate(initialBoard(), "white")).toBe(0);
    expect(evaluate(initialBoard(), "black")).toBe(0);
  });

  it("scores a board with one extra white man positively for white", () => {
    const b = initialBoard();
    b[0][1] = null; // remove a black man
    expect(evaluate(b, "white")).toBeGreaterThan(0);
    expect(evaluate(b, "black")).toBeLessThan(0);
  });

  it("values kings substantially more than men", () => {
    const b = emptyBoard();
    b[5][4] = { color: "white", kind: "man" };
    b[5][6] = { color: "black", kind: "king" };
    expect(evaluate(b, "white")).toBeLessThan(0);
  });
});

describe("pickMove", () => {
  it("returns a legal move on the opening position", async () => {
    const move = await pickMove(initialBoard(), "white", "facile");
    expect(move).not.toBeNull();
    expect(move!.from.row).toBe(6);
  });

  it("returns null when there are no pieces", async () => {
    const move = await pickMove(emptyBoard(), "white", "moyen");
    expect(move).toBeNull();
  });

  it("prefers a forced capture", async () => {
    const b = emptyBoard();
    b[5][4] = { color: "white", kind: "man" };
    b[4][3] = { color: "black", kind: "man" };
    const move = await pickMove(b, "white", "moyen");
    expect(move).not.toBeNull();
    expect(move!.captures).toHaveLength(1);
  });
});
