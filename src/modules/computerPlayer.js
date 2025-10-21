const Player = require("./player");
const helpers = require("./helpers");

class ComputerPlayer extends Player {
  constructor() {
    super();
  }

  attack(opponent) {
    let randCoord = helpers.randomCoordinate();
    console.log(randCoord);

    while (this.checkPrevAttacks(randCoord)) {
      console.log("new random coordinate", randCoord);
      randCoord = helpers.randomCoordinate();
      console.log("new random coordinate", randCoord);
    }

    this.prevAttacks.add(randCoord);
    opponent.gameboard.receiveAttack(randCoord);
  }
}

module.exports = ComputerPlayer;
