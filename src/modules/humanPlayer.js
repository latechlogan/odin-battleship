const Player = require("./player");

class HumanPlayer extends Player {
  attack(coord, opponent) {
    if (this.checkPrevAttacks(coord)) {
      return {
        valid: false,
        reason: "The coordinates have already been used.",
      };
    }
    this.prevAttacks.add(coord);
    opponent.gameboard.receiveAttack(coord);
  }
}

module.exports = HumanPlayer;
