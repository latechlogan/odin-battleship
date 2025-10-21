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

module.exports = { parseCoordinates, formatCoordinate, randomCoordinate };
