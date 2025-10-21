const helpers = require("../src/modules/helpers");
const HumanPlayer = require("../src/modules/humanPlayer");
const ComputerPlayer = require("../src/modules/computerPlayer");
const Ship = require("../src/modules/ship");

describe("Player", () => {
  let player1;
  let player2;

  beforeEach(() => {
    player1 = new HumanPlayer();
    player2 = new ComputerPlayer();
  });

  test("should call receiveAttack on opponents gameboard when attacking", () => {
    let spy = jest.spyOn(player2.gameboard, "receiveAttack");
    player1.attack("A1", player2);
    expect(spy).toHaveBeenCalledWith("A1");
  });

  test("(computer) should launch attack at randomly generated coordinate", () => {
    let spy = jest.spyOn(helpers, "randomCoordinate");
    player2.attack(player1);
    expect(spy).toHaveBeenCalled();
  });

  test("should store attack coordinates", () => {
    player1.attack("A1", player2);
    expect(player1.prevAttacks.size).toBe(1);
  });

  // prevent duplicated coordinates
  test("(human) should not allow attack at repeat coordinates", () => {
    player1.attack("A1", player2);
    expect(player1.attack("A1", player2)).toEqual({
      valid: false,
      reason: "The coordinates have already been used.",
    });
  });

  test("(computer) should not allow attack at repeat coordinates", () => {
    player2.attack(player1);

    const lastAttack = Array.from(player2.prevAttacks)[0];
    jest.spyOn(helpers, "randomCoordinate").mockReturnValueOnce(lastAttack);

    player2.attack(player1);

    expect(player2.prevAttacks.size).toBe(2);
  });

  // return values
  test("(human) should return result object on successful attack", () => {
    const result = player1.attack("A1", player2);
    expect(result).toHaveProperty("valid");
    expect(result.valid).toBe(true);
  });

  test("(human) should return hit status when attacking", () => {
    const destroyer = new Ship(2);
    player2.gameboard.placeShip(destroyer, ["A1", "A2"]);
    const result = player1.attack("A1", player2);
    expect(result.hit).toBe(true);
  });

  test("(human) should return miss status when attacking", () => {
    const result = player1.attack("A1", player2);
    expect(result.hit).toBe(false);
  });

  test("(human) should return isSunk status when ship is sunk", () => {
    const destroyer = new Ship(2);
    player2.gameboard.placeShip(destroyer, ["A1", "A2"]);
    player1.attack("A1", player2);
    const result = player1.attack("A2", player2);
    expect(result.isSunk).toBe(true);
  });

  test("(human) should return gameOver status when fleet is sunk", () => {
    const destroyer = new Ship(2);
    player2.gameboard.placeShip(destroyer, ["A1", "A2"]);
    player1.attack("A1", player2);
    const result = player1.attack("A2", player2);
    expect(result.gameOver).toBe(true);
  });
});
