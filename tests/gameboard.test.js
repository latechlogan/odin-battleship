const Gameboard = require("../src/modules/gameboard");
const Ship = require("../src/modules/ship");

describe("gameboard", () => {
  let testGameboard;

  beforeEach(() => {
    testGameboard = new Gameboard();
  });

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
});
