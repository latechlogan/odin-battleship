const Gameboard = require("./gameboard");

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.prevAttacks = new Set();
  }

  attack(coord, opponent) {
    throw new Error("attack() must be implemented by subclasses");
  }
}

module.exports = Player;
