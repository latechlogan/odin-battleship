const helpers = require("./helpers");

class Gameboard {
  constructor() {
    this.ships = [];
    this.prevAttacks = new Set();
  }

  placeShip(ship, coordinates) {
    let shipCoordinates = helpers.parseCoordinates(coordinates);

    if (ship.length !== shipCoordinates.length) {
      throw new Error("Coordinates don't match ship length");
    }

    if (this.checkAvailability(coordinates) == false) {
      throw new Error("Ships cannot overlap");
    }

    if (this.verifyAdjacent(shipCoordinates) == false) {
      throw new Error("Coordinates must be adjacent");
    }

    if (this.verifyAlignment(shipCoordinates) == false) {
      throw new Error("Coordinates must form a straight line");
    }

    this.ships.push({
      ship: ship,
      coordinates: shipCoordinates,
    });
  }

  receiveAttack(coord) {
    let attackCoordinates;
    try {
      attackCoordinates = helpers.parseCoordinates(coord);
    } catch (error) {
      return {
        valid: false,
        reason: error.message,
      };
    }

    if (this.prevAttacks.has(coord)) {
      return {
        valid: false,
        reason: "The coordinates have already been attacked.",
      };
    }

    this.prevAttacks.add(coord);

    let shipAttacked = this.ships.find((obj) =>
      obj.coordinates.some(
        (coord) =>
          coord[0] === attackCoordinates[0] && coord[1] === attackCoordinates[1]
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
    for (let i = 1; i < targetCoords.length; i++) {
      let [prevX, prevY] = targetCoords[i - 1];
      let [currX, currY] = targetCoords[i];

      if (Math.abs(prevX - currX) > 1 || Math.abs(prevY - currY) > 1) {
        return false;
      }
    }

    return true;
  }

  verifyAlignment(targetCoords) {
    let [compareX, compareY] = targetCoords[0];

    let diffX = targetCoords.filter((coord) => coord[0] !== compareX);
    let diffY = targetCoords.filter((coord) => coord[1] !== compareY);

    if (diffX.length && diffY.length) return false;

    return true;
  }
}

module.exports = Gameboard;
