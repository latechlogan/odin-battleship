const helpers = require("./helpers");

class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, coordinates) {
    this.ships.push({
      ship: ship,
      coordinates: helpers.parseCoordinates(coordinates),
    });
  }

  receiveAttack(coord) {
    let attack = helpers.parseCoordinates(coord);
    let shipAttacked = this.ships.find((obj) =>
      obj.coordinates.some(
        (coord) => coord[0] === attack[0] && coord[1] === attack[1]
      )
    );

    if (shipAttacked) {
      shipAttacked.ship.hit();
      if (shipAttacked.ship.isSunk()) {
        if (this.fleetIsSunk()) return { gameOver: true };
      }
    } else {
      this.missedAttacks.push(attack);
    }
  }

  fleetIsSunk() {
    return this.ships.every((obj) => obj.ship.isSunk());
  }
}

module.exports = Gameboard;
