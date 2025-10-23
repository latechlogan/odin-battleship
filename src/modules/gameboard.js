const helpers = require("./helpers");

class Gameboard {
  constructor() {
    this.ships = [];
    this.prevAttacks = new Set();
  }

  placeShip(ship, coordinates) {
    if (ship.length !== coordinates.length) {
      throw new Error("Coordinates don't match ship length");
    }

    if (helpers.validateCoordinates(coordinates) == false) {
      throw new Error("Coordinates out of bounds");
    }

    if (this.checkAvailability(coordinates) == false) {
      throw new Error("Ships cannot overlap");
    }

    if (this.verifyAdjacent(coordinates) == false) {
      throw new Error("Coordinates must be adjacent");
    }

    if (this.verifyAlignment(coordinates) == false) {
      throw new Error("Coordinates must form a straight line");
    }

    this.ships.push({
      ship: ship,
      coordinates: helpers.parseCoordinates(coordinates),
    });
  }

  receiveAttack(coord) {
    if (helpers.validateCoordinates(coord) == false) {
      return {
        valid: false,
        reason: "The coordinates are out of bounds.",
      };
    }

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

  checkAvailability(targetCoords) {
    let occupied = new Set(
      this.ships.flatMap((obj) =>
        obj.coordinates.flatMap((coord) =>
          helpers.formatCoordinate(coord[0], coord[1])
        )
      )
    );

    for (let target of targetCoords) {
      if (occupied.has(target)) {
        return false;
      }
    }

    return true;
  }

  verifyAdjacent(targetCoords) {
    let targetCoordsArray = helpers.parseCoordinates(targetCoords);

    for (let i = 1; i < targetCoordsArray.length; i++) {
      let [prevX, prevY] = targetCoordsArray[i - 1];
      let [currX, currY] = targetCoordsArray[i];

      if (Math.abs(prevX - currX) > 1 || Math.abs(prevY - currY) > 1) {
        return false;
      }
    }

    return true;
  }

  verifyAlignment(targetCoords) {
    let targetCoordsArray = helpers.parseCoordinates(targetCoords);
    let [compareX, compareY] = targetCoordsArray[0];

    let diffX = targetCoordsArray.filter((coord) => coord[0] !== compareX);
    let diffY = targetCoordsArray.filter((coord) => coord[1] !== compareY);

    if (diffX.length && diffY.length) return false;

    return true;
  }
}

module.exports = Gameboard;
