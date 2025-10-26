const HumanPlayer = require("./humanPlayer");
const ComputerPlayer = require("./computerPlayer");
const Ship = require("./ship");

class Game {
  #isPlayerTurn = true;
  #lastResult = null;

  constructor() {
    this.player = new HumanPlayer();
    // hardcode player ships for development/testing
    this.player.gameboard.placeShip(new Ship(5), [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
    ]);
    this.player.gameboard.placeShip(new Ship(4), ["C1", "C2", "C3", "C4"]);
    this.player.gameboard.placeShip(new Ship(3), ["E1", "E2", "E3"]);
    this.player.gameboard.placeShip(new Ship(3), ["G1", "G2", "G3"]);
    this.player.gameboard.placeShip(new Ship(2), ["I1", "I2"]);

    this.computer = new ComputerPlayer();
    // hardcode computer ships for development/testing
    this.computer.gameboard.placeShip(new Ship(5), [
      "B2",
      "C2",
      "D2",
      "E2",
      "F2",
    ]);
    this.computer.gameboard.placeShip(new Ship(4), ["B4", "C4", "D4", "E4"]);
    this.computer.gameboard.placeShip(new Ship(3), ["B6", "C6", "D6"]);
    this.computer.gameboard.placeShip(new Ship(3), ["H1", "H2", "H3"]);
    this.computer.gameboard.placeShip(new Ship(2), ["J9", "J10"]);
  }

  get gameState() {
    return {
      playerGameboard: this.player.gameboard,
      computerGameboard: this.computer.gameboard,
      isPlayerTurn: this.isPlayerTurn,
      isGameOver: this.isGameOver,
      lastResult: this.#lastResult,
    };
  }

  get isPlayerTurn() {
    return this.#isPlayerTurn;
  }

  get isGameOver() {
    return (
      this.player.gameboard.fleetSunk() || this.computer.gameboard.fleetSunk()
    );
  }

  getWinner() {
    if (!this.isGameOver) return null;

    return this.player.gameboard.fleetSunk() ? "Computer" : "Player";
  }

  reset() {
    this.player = new HumanPlayer();
    // hardcode player ships for development/testing
    this.player.gameboard.placeShip(new Ship(5), [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
    ]);
    this.player.gameboard.placeShip(new Ship(4), ["C1", "C2", "C3", "C4"]);
    this.player.gameboard.placeShip(new Ship(3), ["E1", "E2", "E3"]);
    this.player.gameboard.placeShip(new Ship(3), ["G1", "G2", "G3"]);
    this.player.gameboard.placeShip(new Ship(2), ["I1", "I2"]);

    this.computer = new ComputerPlayer();
    // hardcode computer ships for development/testing
    this.computer.gameboard.placeShip(new Ship(5), [
      "B2",
      "C2",
      "D2",
      "E2",
      "F2",
    ]);
    this.computer.gameboard.placeShip(new Ship(4), ["B4", "C4", "D4", "E4"]);
    this.computer.gameboard.placeShip(new Ship(3), ["B6", "C6", "D6"]);
    this.computer.gameboard.placeShip(new Ship(3), ["H1", "H2", "H3"]);
    this.computer.gameboard.placeShip(new Ship(2), ["J9", "J10"]);

    this.#isPlayerTurn = true;
    this.#lastResult = null;
  }

  playTurn(coord) {
    if (this.isGameOver) {
      return {
        valid: false,
        reason: "Game is over",
      };
    }

    let result;

    if (coord) {
      if (this.isPlayerTurn) {
        this.#isPlayerTurn = !this.#isPlayerTurn;
        result = this.player.attack(coord, this.computer);
      } else {
        return {
          valid: false,
          reason: "It is not the player turn",
        };
      }
    } else {
      if (this.isPlayerTurn) {
        return {
          valid: false,
          reason: "Coordinates must be provided on player turn",
        };
      } else {
        this.#isPlayerTurn = !this.#isPlayerTurn;
        result = this.computer.attack(this.player);
      }
    }

    this.#lastResult = result;
    return result;
  }
}
// Manage turn flow (human attacks → computer attacks)
// Check win conditions

module.exports = Game;
