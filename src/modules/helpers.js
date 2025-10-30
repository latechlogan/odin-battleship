const Ship = require("./ship");

function parseCoordinates(input) {
  const parse = function (input) {
    let regex = /^[a-j]10|[a-j][1-9]$/gi;
    if (!regex.test(input)) {
      throw new Error("Invalid coordinates");
    }

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

function randomCoordinate() {
  const randomize = function () {
    return Math.floor(Math.random() * 10);
  };

  let rowRandom = randomize();
  let colRandom = randomize();

  return formatCoordinate(rowRandom, colRandom);
}

function placeShipsRandom(player) {
  const STANDARD_FLEET = [5, 4, 3, 3, 2];
  const MAX_ATTEMPTS = 1000; // Prevent infinite loops

  for (const shipLength of STANDARD_FLEET) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < MAX_ATTEMPTS) {
      attempts++;

      const ship = new Ship(shipLength);
      const coords = generateRandomCoordinates(shipLength);
      const result = player.gameboard.placeShip(ship, coords);

      if (result.valid) {
        placed = true;
      }
      // If not valid, loop continues to try again
    }

    if (!placed) {
      throw new Error(
        `Failed to place ship of length ${shipLength} after ${MAX_ATTEMPTS} attempts`
      );
    }
  }

  function generateRandomCoordinates(shipLength) {
    const isVertical = Math.random() < 0.6;

    let x, y;

    if (isVertical) {
      // Ship goes down rows, so constrain starting row
      x = Math.floor(Math.random() * (10 - shipLength + 1)); // 0 to (10 - shipLength)
      y = Math.floor(Math.random() * 10); // 0 to 9 (any column is fine)
    } else {
      // Ship goes across columns, so constrain starting column
      x = Math.floor(Math.random() * 10); // 0 to 9 (any row is fine)
      y = Math.floor(Math.random() * (10 - shipLength + 1)); // 0 to (10 - shipLength)
    }

    const coords = [];
    for (let i = 0; i < shipLength; i++) {
      if (isVertical) {
        coords.push(formatCoordinate(x + i, y));
      } else {
        coords.push(formatCoordinate(x, y + i));
      }
    }

    return coords;
  }
}

module.exports = {
  parseCoordinates,
  formatCoordinate,
  randomCoordinate,
  placeShipsRandom,
};
