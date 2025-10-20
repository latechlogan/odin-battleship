const Gameboard = require("../src/modules/gameboard");
const Ship = require("../src/modules/ship");

describe("gameboard", () => {
  let testGameboard;

  beforeEach(() => {
    testGameboard = new Gameboard();
  });

  //ship placement
  it("should place ship at given coordinates", () => {
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

  it("tracks multiple ships", () => {
    const destroyer = new Ship(2);
    const submarine = new Ship(3);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.placeShip(submarine, ["B1", "B2", "B3"]);
    expect(testGameboard.ships.length).toBe(2);
  });

  //attack handling
  it("tracks attacks that hit", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A1");
    expect(destroyer.hits).toBe(1);
  });

  it("tracks attacks that miss", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A3");
    expect(testGameboard.missedAttacks[0]).toEqual([0, 2]);
  });

  it("tracks multiple missed attacks", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A3");
    testGameboard.receiveAttack("A4");
    expect(testGameboard.missedAttacks.length).toBe(2);
  });

  //end game handling
  it("tracks when an entire fleet is sunk", () => {
    const destroyer = new Ship(2);
    testGameboard.placeShip(destroyer, ["A1", "A2"]);
    testGameboard.receiveAttack("A1");
    const result = testGameboard.receiveAttack("A2");
    expect(result).toEqual({ gameOver: true });
  });
});
