const Ship = require("../src/modules/ship");

describe("Ship", () => {
  let testShip;

  beforeEach(() => {
    testShip = new Ship(2);
  });

  test("returns the length of the ship", () => {
    expect(testShip.length).toBe(2);
  });

  test("starts with 0 hits", () => {
    expect(testShip.hits).toBe(0);
  });

  test("updates hits via the hit() method", () => {
    testShip.hit();
    expect(testShip.hits).toBe(1);
  });

  test("is not sunk when first created", () => {
    expect(testShip.sunk()).toBe(false);
  });

  test("updates sunk when hits equal or exceed ship length", () => {
    testShip.hit();
    testShip.hit();
    expect(testShip.sunk()).toBe(true);
  });
});
