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

function randomCoordinate() {
  const randomize = function () {
    return Math.floor(Math.random() * 10);
  };

  let rowRandom = randomize();
  let colRandom = randomize();

  return formatCoordinate(rowRandom, colRandom);
}

function validateCoordinates(coordinates) {
  let coordArray =
    typeof coordinates[0] === "number" ? [coordinates] : coordinates;

  for (let coord of coordArray) {
    let [x, y] = coord;
    if (x < 0 || x > 9 || y < 0 || y > 9) {
      return false;
    }
  }

  return true;
}

module.exports = {
  parseCoordinates,
  formatCoordinate,
  randomCoordinate,
  validateCoordinates,
};
