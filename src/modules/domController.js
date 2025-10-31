const { formatCoordinate } = require("./helpers");

function createGameboard(boardId) {
  const container = document.createElement("div");
  container.classList.add("gameboard");
  container.id = boardId;

  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 11; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // first row AND first col = labels
      if (row === 0 || col === 0) {
        cell.classList.add("cell--label");
        cell.textContent = getLabelContent(row, col);
      } else {
        // game cells
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

function updateBoard(boardElement, gameboard, showShips) {
  let shipSet = new Set();
  let attackSet = new Set(gameboard.prevAttacks);
  let hitSet = new Set();
  let missSet = new Set();
  let sunkSet = new Set();

  gameboard.ships.forEach((obj) => {
    obj.coordinates.forEach(([row, col]) => {
      shipSet.add(formatCoordinate(row, col));
      if (obj.ship.sunk()) {
        sunkSet.add(formatCoordinate(row, col));
      }
    });
  });

  for (const attack of attackSet) {
    if (shipSet.has(attack)) {
      hitSet.add(attack);
    } else {
      missSet.add(attack);
    }
  }

  boardElement.querySelectorAll(".cell--game").forEach((cell) => {
    cell.classList.remove(
      "cell--ship",
      "cell--miss",
      "cell--hit",
      "cell--sunk"
    );
    cell.classList.add("cell--empty");

    if (showShips && shipSet.has(cell.dataset.coord)) {
      cell.classList.remove("cell--empty");
      cell.classList.add("cell--ship");
    }

    if (attackSet.has(cell.dataset.coord)) {
      cell.classList.remove("cell--empty");
      cell.classList.remove("cell--ship");

      if (missSet.has(cell.dataset.coord)) {
        cell.classList.add("cell--miss");
      }

      if (hitSet.has(cell.dataset.coord)) {
        cell.classList.add("cell--hit");
      }

      if (sunkSet.has(cell.dataset.coord)) {
        cell.classList.remove("cell--hit");
        cell.classList.add("cell--sunk");
      }
    }
  });
}

function displayAttacks(state) {
  let attacker = !state.isPlayerTurn ? "Player" : "Computer"; // opposite of what you'd expect
  let attackResult = state.lastResult.hit ? "hit 🔥" : "missed 💦";

  let messageContainer = document.querySelector(".prev-attacks");
  if (messageContainer.childElementCount >= 2) {
    messageContainer.innerHTML = "";
  }

  let message = document.createElement("div");
  message.classList.add("message");
  message.textContent = `${attacker}:  Attack at ${
    state.isPlayerTurn
      ? Array.from(state.playerGameboard.prevAttacks).pop()
      : Array.from(state.computerGameboard.prevAttacks).pop()
  } ${state.lastResult.sunk ? "sunk an opponent ship 💀" : attackResult}`;

  messageContainer.append(message);
}

function displayShipStatus(state) {
  console.log(state);
}

function attachAttackListeners(boardElement, callback) {
  boardElement.addEventListener("click", (e) => {
    if (e.target.classList.contains("cell--game")) {
      callback(e.target.dataset.coord);
    }
  });
}

module.exports = {
  createGameboard,
  updateBoard,
  displayAttacks,
  attachAttackListeners,
};
