import "../src/styles.css";
const Game = require("./modules/game");
const domController = require("./modules/domController");
const helpers = require("./modules/helpers");

let game;
let playerBoard;
let computerBoard;

document.addEventListener("DOMContentLoaded", () => {
  createNewGame();
});

document.querySelector("#new-game").addEventListener("click", () => {
  createNewGame();
});

document
  .querySelector("#randomize-player-ships")
  .addEventListener("click", () => {
    game.player.gameboard.clearShips();
    helpers.placeShipsRandom(game.player);
    domController.updateBoard(playerBoard, game.player.gameboard, true);
  });

function clearDynamicContent() {
  document.querySelector(".prev-attacks").innerHTML = "";
  document.querySelector(".ship-status").innerHTML = "";
  document.querySelector(".alerts").innerHTML = `
    <div class="winner-message">Defeat the<br />enemy fleet.</div>
  `;
}

function createNewGame() {
  clearDynamicContent();
  game = new Game();
  initGame(game);
}

function initGame(game) {
  // enable ship placement with new game initialization
  document.querySelector("#randomize-player-ships").disabled = false;

  // create and update both gameboards
  const playerBoardContainer = document.querySelector(
    "#player-board-container"
  );
  const computerBoardContainer = document.querySelector(
    "#computer-board-container"
  );

  playerBoard = domController.createGameboard("player-board");
  computerBoard = domController.createGameboard("computer-board");

  playerBoardContainer.innerHTML = "";
  playerBoardContainer.appendChild(playerBoard);
  domController.updateBoard(playerBoard, game.player.gameboard, true);

  computerBoardContainer.innerHTML = "";
  computerBoardContainer.appendChild(computerBoard);
  domController.updateBoard(computerBoard, game.computer.gameboard, false);

  // attach event listeners for gameplay
  domController.attachAttackListeners(computerBoard, (coord) => {
    let result;

    if (game.isGameOver) {
      return;
    } else {
      result = game.playTurn(coord);
    }

    if (!result.valid) return;

    if (result.valid) {
      domController.updateBoard(computerBoard, game.computer.gameboard, false);
      domController.displayAttacks(game.gameState);
      domController.displayShipStatus(game.gameState);
    }

    if (result.gameOver) {
      domController.displayWinner(game.gameState);
      return;
    }

    game.playTurn();
    domController.updateBoard(playerBoard, game.player.gameboard, true);
    domController.displayAttacks(game.gameState);
    domController.displayShipStatus(game.gameState);

    if (game.isGameOver) {
      domController.displayWinner(game.gameState);
    }
  });
}
