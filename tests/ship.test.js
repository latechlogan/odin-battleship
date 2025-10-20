const Ship = require("../src/modules/ship");

describe("Ship", () => {
  let testShip;

  beforeEach(() => {
    testShip = new Ship(2);
  });

  it("returns the length of the ship", () => {
    expect(testShip.length).toBe(2);
  });

  it("starts with 0 hits", () => {
    expect(testShip.hits).toBe(0);
  });

  it("updates hits via the hit() method", () => {
    testShip.hit();
    expect(testShip.hits).toBe(1);
  });

  it("is not sunk when first created", () => {
    expect(testShip.isSunk()).toBe(false);
  });

  it("updates isSunk when hits equal or exceed ship length", () => {
    testShip.hit();
    testShip.hit();
    expect(testShip.isSunk()).toBe(true);
  });
});
