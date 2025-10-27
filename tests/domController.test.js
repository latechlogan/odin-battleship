const domController = require('../src/modules/domController');
const Gameboard = require('../src/modules/gameboard');
const Ship = require('../src/modules/ship');

describe("domController", () => {
  describe("createGameboard", () => {
    let boardElement;

    beforeEach(() => {
      boardElement = domController.createGameboard('test-board');
    });

    test("creates a gameboard element with correct ID", () => {
      expect(boardElement.id).toBe('test-board');
      expect(boardElement.classList.contains('gameboard')).toBe(true);
    });

    test("creates 121 total cells (11 x 11 grid)", () => {
      const allCells = boardElement.querySelectorAll('.cell');
      expect(allCells.length).toBe(121);
    });

    test("creates 20 label cells and 100 game cells", () => {
      const labelCells = boardElement.querySelectorAll('.cell--label');
      const gameCells = boardElement.querySelectorAll('.cell--game');

      expect(labelCells.length).toBe(20); // 10 column labels + 10 row labels
      expect(gameCells.length).toBe(100); // 10x10 game grid
    });

    test("first row contains column number labels 1-10", () => {
      const allCells = boardElement.querySelectorAll('.cell');

      // First row is cells 0-10 (0 is corner, 1-10 are column labels)
      expect(allCells[1].textContent).toBe('1');
      expect(allCells[2].textContent).toBe('2');
      expect(allCells[3].textContent).toBe('3');
      expect(allCells[10].textContent).toBe('10');
    });

    test("first column contains row letter labels A-J", () => {
      const allCells = boardElement.querySelectorAll('.cell');

      // First cell of each row: indices 11, 22, 33, etc.
      expect(allCells[11].textContent).toBe('A');
      expect(allCells[22].textContent).toBe('B');
      expect(allCells[33].textContent).toBe('C');
      expect(allCells[110].textContent).toBe('J');
    });

    test("corner cell (0,0) is empty label cell", () => {
      const allCells = boardElement.querySelectorAll('.cell');
      const cornerCell = allCells[0];

      expect(cornerCell.classList.contains('cell--label')).toBe(true);
      expect(cornerCell.textContent).toBe('');
    });

    test("label cells do not have data-coord attribute", () => {
      const labelCells = boardElement.querySelectorAll('.cell--label');

      labelCells.forEach(cell => {
        expect(cell.dataset.coord).toBeUndefined();
      });
    });

    test("all game cells have data-coord attribute", () => {
      const gameCells = boardElement.querySelectorAll('.cell--game');

      expect(gameCells.length).toBe(100);
      gameCells.forEach(cell => {
        expect(cell.dataset.coord).toBeDefined();
        expect(cell.dataset.coord).toMatch(/^[A-J]([1-9]|10)$/);
      });
    });

    test("game cells have correct coordinate mapping", () => {
      const allCells = boardElement.querySelectorAll('.cell');

      // Cell at index 12 should be A1 (row 1, col 1 after labels)
      expect(allCells[12].dataset.coord).toBe('A1');

      // Cell at index 13 should be A2
      expect(allCells[13].dataset.coord).toBe('A2');

      // Cell at index 21 should be A10 (end of first game row)
      expect(allCells[21].dataset.coord).toBe('A10');

      // Cell at index 23 should be B1 (start of second game row)
      expect(allCells[23].dataset.coord).toBe('B1');

      // Last cell (index 120) should be J10
      expect(allCells[120].dataset.coord).toBe('J10');
    });
  });

  describe("updateBoard", () => {
    let boardElement;
    let gameboard;

    beforeEach(() => {
      boardElement = domController.createGameboard('test-board');
      gameboard = new Gameboard();
    });

    test("marks cells with ships when showShips is true", () => {
      gameboard.placeShip(new Ship(3), ['A1', 'A2', 'A3']);

      domController.updateBoard(boardElement, gameboard, true);

      const a1Cell = boardElement.querySelector('[data-coord="A1"]');
      const a2Cell = boardElement.querySelector('[data-coord="A2"]');
      const a3Cell = boardElement.querySelector('[data-coord="A3"]');
      const b1Cell = boardElement.querySelector('[data-coord="B1"]');

      expect(a1Cell.classList.contains('cell--ship')).toBe(true);
      expect(a2Cell.classList.contains('cell--ship')).toBe(true);
      expect(a3Cell.classList.contains('cell--ship')).toBe(true);
      expect(b1Cell.classList.contains('cell--ship')).toBe(false);
    });

    test("does not mark cells with ships when showShips is false", () => {
      gameboard.placeShip(new Ship(3), ['A1', 'A2', 'A3']);

      domController.updateBoard(boardElement, gameboard, false);

      const a1Cell = boardElement.querySelector('[data-coord="A1"]');

      expect(a1Cell.classList.contains('cell--ship')).toBe(false);
    });

    test("marks cells as hit when attacked and hit a ship", () => {
      gameboard.placeShip(new Ship(3), ['A1', 'A2', 'A3']);
      gameboard.receiveAttack('A1');

      domController.updateBoard(boardElement, gameboard, true);

      const a1Cell = boardElement.querySelector('[data-coord="A1"]');

      expect(a1Cell.classList.contains('cell--hit')).toBe(true);
    });

    test("marks cells as miss when attacked and missed", () => {
      gameboard.placeShip(new Ship(3), ['A1', 'A2', 'A3']);
      gameboard.receiveAttack('B1');

      domController.updateBoard(boardElement, gameboard, true);

      const b1Cell = boardElement.querySelector('[data-coord="B1"]');

      expect(b1Cell.classList.contains('cell--miss')).toBe(true);
    });

    test("marks cells as sunk when ship is completely destroyed", () => {
      gameboard.placeShip(new Ship(2), ['A1', 'A2']);
      gameboard.receiveAttack('A1');
      gameboard.receiveAttack('A2');

      domController.updateBoard(boardElement, gameboard, true);

      const a1Cell = boardElement.querySelector('[data-coord="A1"]');
      const a2Cell = boardElement.querySelector('[data-coord="A2"]');

      expect(a1Cell.classList.contains('cell--sunk')).toBe(true);
      expect(a2Cell.classList.contains('cell--sunk')).toBe(true);
    });

    test("shows hits on enemy board even when showShips is false", () => {
      gameboard.placeShip(new Ship(3), ['A1', 'A2', 'A3']);
      gameboard.receiveAttack('A1');

      domController.updateBoard(boardElement, gameboard, false);

      const a1Cell = boardElement.querySelector('[data-coord="A1"]');
      const a2Cell = boardElement.querySelector('[data-coord="A2"]');

      // Should show hit even though ships are hidden
      expect(a1Cell.classList.contains('cell--hit')).toBe(true);
      // Should not show unhit ship location
      expect(a2Cell.classList.contains('cell--ship')).toBe(false);
    });

    test("removes old state classes before applying new ones", () => {
      gameboard.placeShip(new Ship(2), ['A1', 'A2']);

      // First update - shows ship
      domController.updateBoard(boardElement, gameboard, true);
      const a1Cell = boardElement.querySelector('[data-coord="A1"]');
      expect(a1Cell.classList.contains('cell--ship')).toBe(true);

      // Attack the cell
      gameboard.receiveAttack('A1');

      // Second update - should show hit, not ship
      domController.updateBoard(boardElement, gameboard, true);
      expect(a1Cell.classList.contains('cell--hit')).toBe(true);
      expect(a1Cell.classList.contains('cell--ship')).toBe(false);
    });
  });

  describe("attachAttackListeners", () => {
    let boardElement;
    let mockCallback;

    beforeEach(() => {
      boardElement = domController.createGameboard('test-board');
      mockCallback = jest.fn();
      domController.attachAttackListeners(boardElement, mockCallback);
    });

    test("calls callback with correct coordinate when game cell is clicked", () => {
      const gameCell = boardElement.querySelector('[data-coord="A5"]');
      gameCell.click();

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('A5');
    });

    test("does not call callback when label cell is clicked", () => {
      const labelCell = boardElement.querySelector('.cell--label');
      labelCell.click();

      expect(mockCallback).not.toHaveBeenCalled();
    });

    test("calls callback with correct coordinates for multiple cells", () => {
      const a1Cell = boardElement.querySelector('[data-coord="A1"]');
      const j10Cell = boardElement.querySelector('[data-coord="J10"]');

      a1Cell.click();
      j10Cell.click();

      expect(mockCallback).toHaveBeenCalledTimes(2);
      expect(mockCallback).toHaveBeenNthCalledWith(1, 'A1');
      expect(mockCallback).toHaveBeenNthCalledWith(2, 'J10');
    });

    test("works with all 100 game cells", () => {
      const gameCells = boardElement.querySelectorAll('.cell--game');

      expect(gameCells.length).toBe(100);

      // Click a few random ones to verify
      gameCells[0].click(); // A1
      gameCells[50].click(); // Somewhere in the middle
      gameCells[99].click(); // J10

      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });
});