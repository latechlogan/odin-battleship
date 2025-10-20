function parseCoordinates(input) {
  const parse = function (input) {
    const letter = input[0];
    const number = parseInt(input.slice(1));
    const row = letter.charCodeAt(0) - 65; //'A' = 65 in ASCII
    const col = number - 1;
    return [row, col];
  };

  if (typeof input === "string") {
    return parse(input);
  } else {
    return input.map((coord) => {
      return parse(coord);
    });
  }
}

function formatCoordinate(row, col) {
  const letter = String.fromCharCode(65 + row);
  const number = col + 1;
  return `${letter}${number}`;
}

class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, coordinates) {
    this.ships.push({
      ship: ship,
      coordinates: parseCoordinates(coordinates),
    });
  }

  receiveAttack(coord) {
    let attack = parseCoordinates(coord);
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
