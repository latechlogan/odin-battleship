const helpers = require("./helpers");

class Gameboard {
  constructor() {
    this.ships = [];
    this.prevAttacks = new Set();
  }

  placeShip(ship, coordinates) {
    this.ships.push({
      ship: ship,
      coordinates: helpers.parseCoordinates(coordinates),
    });
  }

  receiveAttack(coord) {
    if (this.prevAttacks.has(coord)) {
      return {
        valid: false,
        reason: "The coordinates have already been attacked.",
      };
    }

    this.prevAttacks.add(coord);

    let attack = helpers.parseCoordinates(coord);
    let shipAttacked = this.ships.find((obj) =>
      obj.coordinates.some(
        (coord) => coord[0] === attack[0] && coord[1] === attack[1]
      )
    );

    if (shipAttacked) {
      shipAttacked.ship.hit();
      if (shipAttacked.ship.isSunk()) {
        if (this.fleetIsSunk()) {
          return { hit: true, isSunk: true, gameOver: true };
        }
        return { hit: true, isSunk: true, gameOver: false };
      }
      return { hit: true, isSunk: false, gameOver: false };
    } else {
      this.missedAttacks.push(attack);
      return { hit: false, isSunk: false, gameOver: false };
    }
  }

  fleetSunk() {
    return this.ships.every((obj) => obj.ship.sunk());
  }
}

module.exports = Gameboard;
