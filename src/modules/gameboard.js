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
      if (shipAttacked.ship.sunk()) {
        if (this.fleetSunk()) {
          return { valid: true, hit: true, sunk: true, gameOver: true };
        }
        return { valid: true, hit: true, sunk: true, gameOver: false };
      }
      return { valid: true, hit: true, sunk: false, gameOver: false };
    }
    return { valid: true, hit: false, sunk: false, gameOver: false };
  }

  fleetSunk() {
    return this.ships.every((obj) => obj.ship.sunk());
  }
}

module.exports = Gameboard;
