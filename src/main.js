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
  domController.updateBoard(playerBoard, game.player.gameboard, true);
  computerBoardContainer.appendChild(computerBoard);
  domController.updateBoard(computerBoard, game.computer.gameboard, false);

  domController.attachAttackListeners(computerBoard, (coord) => {
    const result = game.player.attack(coord, game.computer);

    if (!result.valid) return;

    if (result.valid) {
      domController.updateBoard(computerBoard, game.computer.gameboard, false);
    }

    if (result.gameOver) {
      console.log("You win!");
    }

    game.computer.attack(game.player);

    domController.updateBoard(playerBoard, game.player.gameboard, true);
  });
});
