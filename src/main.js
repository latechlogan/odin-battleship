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

function createNewGame() {
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
  helpers.placeShipsRandom(game.player);
  domController.updateBoard(playerBoard, game.player.gameboard, true);

  computerBoardContainer.innerHTML = "";
  computerBoardContainer.appendChild(computerBoard);
  helpers.placeShipsRandom(game.computer);
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
    }

    if (result.gameOver) {
      console.log("You win!");
      return;
    }

    game.playTurn();
    domController.updateBoard(playerBoard, game.player.gameboard, true);
  });
}
