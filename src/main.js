import "../src/styles.css";
const Game = require("./modules/game");
const domController = require("./modules/domController");

let game;

document.addEventListener("DOMContentLoaded", () => {
  createNewGame();
});

document.querySelector("#new-game").addEventListener("click", () => {
  createNewGame();
});

// add reset button

function createNewGame() {
  game = new Game();
  initGame(game);
}

function initGame(game) {
  // create and update both gameboards
  const playerBoardContainer = document.querySelector(
    "#player-board-container"
  );
  const computerBoardContainer = document.querySelector(
    "#computer-board-container"
  );

  const playerBoard = domController.createGameboard("player-board");
  const computerBoard = domController.createGameboard("computer-board");

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
      result = game.player.attack(coord, game.computer);
    }

    if (!result.valid) return;

    if (result.valid) {
      domController.updateBoard(computerBoard, game.computer.gameboard, false);
    }

    if (result.gameOver) {
      console.log("You win!");
      return;
    }

    game.computer.attack(game.player);

    domController.updateBoard(playerBoard, game.player.gameboard, true);
  });
}
