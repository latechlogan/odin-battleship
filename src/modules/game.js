const HumanPlayer = require("./humanPlayer");
const ComputerPlayer = require("./computerPlayer");

class Game {
  #isPlayerTurn = true;
  #lastResult = null;

  constructor() {
    this.player = new HumanPlayer();
    this.computer = new ComputerPlayer();
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
        result = this.player.attack(coord, this.computer);
        if (result.valid) {
          this.#isPlayerTurn = !this.#isPlayerTurn;
        }
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
        result = this.computer.attack(this.player);
        if (result.valid) {
          this.#isPlayerTurn = !this.#isPlayerTurn;
        }
      }
    }

    this.#lastResult = result;
    return result;
  }
}

module.exports = Game;
