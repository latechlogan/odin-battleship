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
    let result = opponent.gameboard.receiveAttack(coord);
    return {
      valid: true,
      hit: result.hit,
      isSunk: result.isSunk,
      gameOver: result.gameOver,
    };
  }
}

module.exports = HumanPlayer;
