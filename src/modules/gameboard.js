function parseCoordinate(array) {
  return array.map((coord) => {
    const letter = coord[0];
    const number = parseInt(coord.slice(1));
    const row = letter.charCodeAt(0) - 65; // 'A' = 65 in ASCII
    const col = number - 1;
    return [row, col];
  });
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
      coordinates: parseCoordinate(coordinates),
    });
  }
}

module.exports = Gameboard;
