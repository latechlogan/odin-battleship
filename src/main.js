import "../src/styles.css";
const Game = require("./modules/game");
const domController = require("./modules/domController");

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  const playerBoardContainer = document.querySelector(
    "#player-board-container"
  );
  const computerBoardContainer = document.querySelector(
    "#computer-board-container"
  );

  const playerBoard = domController.createGameboard("player-board");
  const computerBoard = domController.createGameboard("computer-board");

  playerBoardContainer.appendChild(playerBoard);
  computerBoardContainer.appendChild(computerBoard);
});
