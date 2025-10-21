const Player = require("./player");
const helpers = require("./helpers");

class ComputerPlayer extends Player {
  constructor() {
    super();
  }

  attack(opponent) {
    let randCoord = helpers.randomCoordinate();

    while (this.checkPrevAttacks(randCoord)) {
      randCoord = helpers.randomCoordinate();
    }

    this.prevAttacks.add(randCoord);
    opponent.gameboard.receiveAttack(randCoord);
  }
}

module.exports = ComputerPlayer;
