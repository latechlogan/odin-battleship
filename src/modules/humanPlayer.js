const Player = require("./player");

class HumanPlayer extends Player {
  attack(coord, opponent) {
    if (this.prevAttacks.has(coord)) {
      return {
        valid: false,
        reason: "The coordinates have already been used.",
      };
    }
    this.prevAttacks.add(coord);
    return opponent.gameboard.receiveAttack(coord);
  }
}

module.exports = HumanPlayer;
