const helpers = require("../src/modules/helpers");
const HumanPlayer = require("../src/modules/humanPlayer");
const ComputerPlayer = require("../src/modules/computerPlayer");

describe("Player", () => {
  let player1;
  let player2;

  beforeEach(() => {
    player1 = new HumanPlayer();
    player2 = new ComputerPlayer();
  });

  it("should call receiveAttack on opponents gameboard when attacking", () => {
    let spy = jest.spyOn(player2.gameboard, "receiveAttack");
    player1.attack("A1", player2);
    expect(spy).toHaveBeenCalledWith("A1");
  });

  it("(computer) should launch attack at randomly generated coordinate", () => {
    let spy = jest.spyOn(helpers, "randomCoordinate");
    player2.attack(player1);
    expect(spy).toHaveBeenCalled();
  });

  it("should store attack coordinates", () => {
    player1.attack("A1", player2);
    expect(player1.prevAttacks.size).toBe(1);
  });

  it("(human) should not allow attack at repeat coordinates", () => {
    player1.attack("A1", player2);
    expect(player1.attack("A1", player2)).toEqual({
      valid: false,
      reason: "The coordinates have already been used.",
    });
  });

  it("(computer) should not allow attack at repeat coordinates", () => {
    console.log("=== REPEAT ATTACK TEST START ===");
    player2.attack(player1);

    const lastAttack = Array.from(player2.prevAttacks)[0];
    jest.spyOn(helpers, "randomCoordinate").mockReturnValueOnce(lastAttack);

    player2.attack(player1);

    console.log(
      `lastAttack:`,
      lastAttack,
      `Player 2 previous attacks:`,
      player2.prevAttacks
    );

    expect(player2.prevAttacks.size).toBe(2);
  });
});
