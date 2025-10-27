function createGameboard(boardId) {
  const container = document.createElement("div");
  container.classList.add("gameboard");
  container.id = boardId;

  // Create 121 cells
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 11; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // First row AND first col = labels
      if (row === 0 || col === 0) {
        cell.classList.add("cell--label");
        cell.textContent = getLabelContent(row, col);
      } else {
        // Game cells
        cell.classList.add("cell--game");
        const coord = coordFromIndices(row - 1, col); // "A5"
        cell.dataset.coord = coord;
      }

      container.appendChild(cell);
    }
  }

  return container;
}

function coordFromIndices(x, y) {
  let letter = String.fromCharCode(65 + x);
  let number = y;
  return `${letter}${number}`;
}

function getLabelContent(row, col) {
  if (row === 0 && col === 0) return ""; // corner
  if (row === 0) return col; // numbers 1-10
  if (col === 0) return String.fromCharCode(64 + row); // A-J
}

module.exports = {
  createGameboard,
};
