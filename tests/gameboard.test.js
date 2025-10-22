const Gameboard = require("../src/modules/gameboard");
const Ship = require("../src/modules/ship");

describe("gameboard", () => {
  let testGameboard;

  beforeEach(() => {
    testGameboard = new Gameboard();
  });

  //ship placement
  test("should place ship at given coordinates", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    expect(testGameboard.ships[0]).toEqual({
      ship: destroyer,
      coordinates: [
        [0, 0],
        [0, 1],
      ],
    });
  });

  test("tracks multiple ships", () => {
    const destroyer = new Ship(2);
    const submarine = new Ship(3);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.placeShip(submarine, ["B1", "B2", "B3"]);
    expect(testGameboard.ships.length).toBe(2);
  });

  //attack handling
  test("tracks attacks that hit", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A1");
    expect(destroyer.hits).toBe(1);
  });

  test("tracks attacks that miss", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A3");
    expect(testGameboard.prevAttacks.has("A3")).toBe(true);
  });

  test("tracks multiple attacks", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A1"); // hit
    testGameboard.receiveAttack("A3"); // miss
    testGameboard.receiveAttack("A4"); // miss
    expect(testGameboard.prevAttacks.size).toBe(3);
  });

  //end game handling
  test("tracks when an entire fleet is sunk", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A1");
    const result = testGameboard.receiveAttack("A2");
    expect(result).toHaveProperty("gameOver");
    expect(result.gameOver).toBe(true);
  });

  // return value consistency
  test("returns hit status when attack hits a ship", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    const result = testGameboard.receiveAttack("A1");
    expect(result.hit).toBe(true);
  });

  test("returns miss status when attack misses", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    const result = testGameboard.receiveAttack("B1");
    expect(result.hit).toBe(false);
  });

  test("returns sunk status when ship is sunk", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A1");
    const result = testGameboard.receiveAttack("A2");
    expect(result.sunk).toBe(true);
  });

  test("returns sunk as false when ship is hit but not sunk", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    const result = testGameboard.receiveAttack("A1");
    expect(result.sunk).toBe(false);
  });

  // checking if coordinate was attacked
  test("can check if a coordinate has been attacked (hit)", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A1");
    const result = testGameboard.receiveAttack("A1");
    expect(result.valid).toBe(false);
  });

  test("can check if a coordinate has been attacked (miss)", () => {
    testGameboard.receiveAttack("B1");
    const result = testGameboard.receiveAttack("B1");
    expect(result.valid).toBe(false);
  });

  test("returns valid for coordinates that have not been attacked", () => {
    const result = testGameboard.receiveAttack("A1");
    expect(result.valid).toBe(true);
  });
});
