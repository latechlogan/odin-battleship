const Game = require("../src/modules/game");
const HumanPlayer = require("../src/modules/humanPlayer");
const ComputerPlayer = require("../src/modules/computerPlayer");
const helpers = require("../src/modules/helpers");

// shipIndices parameter takes an array
function sinkShips(gameboard, shipIndices) {
  shipIndices.forEach((i) => {
    for (let j = 0; j < gameboard.ships[i].ship.length; j++) {
      gameboard.ships[i].ship.hit();
    }
  });
}

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  describe("Initialization", () => {
    test("should create a human player", () => {
      expect(game.player).toBeInstanceOf(HumanPlayer);
    });

    test("should create a computer player", () => {
      expect(game.computer).toBeInstanceOf(ComputerPlayer);
    });

    test("should initialize with player's turn", () => {
      expect(game.isPlayerTurn).toBe(true);
    });

    test("should place ships on player's gameboard", () => {
      expect(game.player.gameboard.ships.length).toBe(5);
    });

    test("should place ships on computer's gameboard", () => {
      expect(game.computer.gameboard.ships.length).toBe(5);
    });

    test("should not be game over initially", () => {
      expect(game.isGameOver).toBe(false);
    });
  });

  describe("Turn Management", () => {
    test("should allow player to attack on player's turn", () => {
      const result = game.playTurn("A1");
      expect(result).toHaveProperty("valid");
      expect(result.valid).toBe(true);
    });

    test("should switch to computer's turn after player attacks", () => {
      game.playTurn("A1");
      expect(game.isPlayerTurn).toBe(false);
    });

    test("should switch back to player's turn after computer attacks", () => {
      game.playTurn("A1"); // Player turn
      game.playTurn(); // Computer turn (no coordinate needed)
      expect(game.isPlayerTurn).toBe(true);
    });

    test("should not allow player attack when it's computer's turn", () => {
      game.playTurn("A1"); // Player turn, now computer's turn
      const result = game.playTurn("B2"); // Try to attack on computer's turn
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/not.*turn/i);
    });

    test("should automatically execute computer turn", () => {
      game.playTurn("A1"); // Player attacks
      const computerAttacksBefore = game.player.gameboard.prevAttacks.size;
      game.playTurn(); // Computer turn
      const computerAttacksAfter = game.player.gameboard.prevAttacks.size;
      expect(computerAttacksAfter).toBeGreaterThan(computerAttacksBefore);
    });
  });

  describe("Attack Results", () => {
    test("should return attack result with valid, hit, sunk, and gameOver properties", () => {
      const result = game.playTurn("A1");
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("hit");
      expect(result).toHaveProperty("sunk");
      expect(result).toHaveProperty("gameOver");
    });

    test("should track attacks on computer's gameboard", () => {
      const attacksBefore = game.computer.gameboard.prevAttacks.size;
      game.playTurn("A1");
      const attacksAfter = game.computer.gameboard.prevAttacks.size;
      expect(attacksAfter).toBe(attacksBefore + 1);
    });

    test("should track attacks on player's gameboard during computer turn", () => {
      game.playTurn("A1"); // Player turn
      const attacksBefore = game.player.gameboard.prevAttacks.size;
      game.playTurn(); // Computer turn
      const attacksAfter = game.player.gameboard.prevAttacks.size;
      expect(attacksAfter).toBe(attacksBefore + 1);
    });
  });

  describe("Game State", () => {
    test("should provide current game state", () => {
      const state = game.gameState;
      expect(state).toHaveProperty("playerGameboard");
      expect(state).toHaveProperty("computerGameboard");
      expect(state).toHaveProperty("isPlayerTurn");
      expect(state).toHaveProperty("isGameOver");
    });

    test("should include last turn result in game state", () => {
      game.playTurn("A1");
      const state = game.gameState;
      expect(state).toHaveProperty("lastResult");
      expect(state.lastResult).toHaveProperty("valid");
    });
  });

  describe("Win Conditions", () => {
    test("should detect when player wins (all computer ships sunk)", () => {
      sinkShips(game.computer.gameboard, [0, 1, 2, 3]);
      game.computer.gameboard.ships[4].ship.hit();
      const result = game.playTurn("J9");
      expect(result.gameOver).toBe(true);
      expect(game.isGameOver).toBe(true);
    });

    test("should detect when computer wins (all player ships sunk)", () => {
      sinkShips(game.player.gameboard, [0, 1, 2, 3]);
      game.player.gameboard.ships[4].ship.hit();
      jest.spyOn(helpers, "randomCoordinate").mockReturnValue("I2");
      game.playTurn("A1"); // player turn
      const result = game.playTurn(); // computer turn
      expect(result.gameOver).toBe(true);
      expect(game.isGameOver).toBe(true);
    });

    test("should identify winner when game is over", () => {
      sinkShips(game.computer.gameboard, [0, 1, 2, 3, 4]);
      const winner = game.getWinner();
      expect(winner).toBe("Player");
    });

    test("should return null winner when game is not over", () => {
      const winner = game.getWinner();
      expect(winner).toBeNull();
    });

    test("should not allow turns after game is over", () => {
      jest.spyOn(game.computer.gameboard, "fleetSunk").mockReturnValue(true);
      game.playTurn("A1"); // Game over
      const result = game.playTurn("B2"); // Try another turn
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/game.*over/i);
    });
  });

  describe("Game Reset", () => {
    test("should reset the game to initial state", () => {
      game.playTurn("A1");
      game.playTurn("B2");
      game.reset();
      expect(game.isPlayerTurn).toBe(true);
      expect(game.isGameOver).toBe(false);
      expect(game.player.gameboard.prevAttacks.size).toBe(0);
      expect(game.computer.gameboard.prevAttacks.size).toBe(0);
    });

    test("should create new players with fresh gameboards on reset", () => {
      const oldPlayer = game.player;
      game.reset();
      expect(game.player).not.toBe(oldPlayer);
    });
  });

  describe("Ship Placement", () => {
    test("should place exactly 5 ships for player", () => {
      const shipLengths = game.player.gameboard.ships.map((s) => s.ship.length);
      expect(shipLengths).toEqual([5, 4, 3, 3, 2]);
    });

    test("should place exactly 5 ships for computer", () => {
      const shipLengths = game.computer.gameboard.ships.map(
        (s) => s.ship.length
      );
      expect(shipLengths).toEqual([5, 4, 3, 3, 2]);
    });

    test("should place ships at valid coordinates", () => {
      game.player.gameboard.ships.forEach((shipData) => {
        expect(shipData.coordinates.length).toBe(shipData.ship.length);
      });
    });
  });
});
