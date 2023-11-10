const app = {
  init: function () {
    app.drawBoard();

    const launchScript = document.querySelector("#launchScript");
    const resetScript = document.querySelector("#resetScript");
    launchScript.addEventListener("click", app.handleLaunchScriptButton);
    resetScript.addEventListener("click", app.handleResetScriptButton);
  },

  drawBoard: function () {
    // Creating the grid
    const board = document.querySelector("#board");
    const rows = 6;
    const columns = 8;

    for (let i = 0; i < rows; i++) {
      const cellRow = document.createElement("div");
      cellRow.classList.add("cellRow");
      cellRow.setAttribute("id", "row" + i);

      for (let j = 0; j < columns; j++) {
        const cellColumn = document.createElement("div");
        cellColumn.classList.add("cell");
        cellColumn.dataset.column = j;
        cellColumn.dataset.row = i;
        cellRow.append(cellColumn);
      }
      board.append(cellRow);
    }

    // Random starting point with the cursor
    const cells = document.querySelectorAll('.cell');
    console.log(cells)
    let cellStartRandom = Math.floor(Math.random() * cells.length);
    const randomStart = cells[cellStartRandom];
    randomStart.classList.add("cellStart")

    // The arrow is on the starting point
    randomStart.classList.add("cellCurrent");
    randomStart.classList.add("cellCurrent-right");

    // The end point
    let cellEndRandom = Math.floor(Math.random() * cells.length);
    const randomEnd = cells[cellEndRandom];
    randomEnd.classList.add("cellEnd")
  },

  moveForward: function () {
    const cellCurrent = document.querySelector(".cellCurrent");

    // Check if the current cell is the endpoint
    if (cellCurrent.classList.contains("cellEnd")) {
      alert("YOU WIN");
      return; // Stop the function here if you win
    }

    // In which direction is the cursor
    const top = cellCurrent.classList.contains("cellCurrent-top");
    const bottom = cellCurrent.classList.contains("cellCurrent-bottom");
    const right = cellCurrent.classList.contains("cellCurrent-right");
    const left = cellCurrent.classList.contains("cellCurrent-left");

    if (top) {
      const currentRow = cellCurrent.parentElement;
      const previousRow = currentRow.previousElementSibling;
      if (previousRow) {
        const cells = previousRow.querySelectorAll(".cell");
        const cell = cells[cellCurrent.dataset.column];
        cellCurrent.classList.remove("cellCurrent", "cellCurrent-top");
        cell.classList.add("cellCurrent", "cellCurrent-top");
      } else {
        alert("You've gone off the grid!");
      }
    } else if (bottom) {
      const currentRow = cellCurrent.parentElement;
      const nextRow = currentRow.nextElementSibling;
      if (nextRow) {
        const cells = nextRow.querySelectorAll(".cell");
        const cell = cells[cellCurrent.dataset.column];
        cellCurrent.classList.remove("cellCurrent", "cellCurrent-bottom");
        cell.classList.add("cellCurrent", "cellCurrent-bottom");
      } else {
        alert("You've gone off the grid!");
      }
    } else if (right) {
      const nextCell = cellCurrent.nextElementSibling;
      if (nextCell) {
        cellCurrent.classList.remove("cellCurrent", "cellCurrent-right");
        nextCell.classList.add("cellCurrent", "cellCurrent-right");
      } else {
        alert("You've gone off the grid!");
      }
    } else if (left) {
      const previousCell = cellCurrent.previousElementSibling;
      if (previousCell) {
        cellCurrent.classList.remove("cellCurrent", "cellCurrent-left");
        previousCell.classList.add("cellCurrent", "cellCurrent-left");
      } else {
        alert("You've gone off the grid!");
      }
    }
  },

  turnRight: function () {
    const cursor = document.querySelector(".cellCurrent");
    if (cursor.classList.contains("cellCurrent-right")) {
      cursor.classList.remove("cellCurrent-right");
      cursor.classList.add("cellCurrent-bottom");
    } else if (cursor.classList.contains("cellCurrent-bottom")) {
      cursor.classList.remove("cellCurrent-bottom");
      cursor.classList.add("cellCurrent-left");
    } else if (cursor.classList.contains("cellCurrent-left")) {
      cursor.classList.remove("cellCurrent-left");
      cursor.classList.add("cellCurrent-top");
    } else if (cursor.classList.contains("cellCurrent-top")) {
      cursor.classList.remove("cellCurrent-top");
      cursor.classList.add("cellCurrent-right");
    }
  },

  turnLeft: function () {
    const cursor = document.querySelector(".cellCurrent");
    if (cursor.classList.contains("cellCurrent-right")) {
      cursor.classList.remove("cellCurrent-right");
      cursor.classList.add("cellCurrent-top");
    } else if (cursor.classList.contains("cellCurrent-top")) {
      cursor.classList.remove("cellCurrent-top");
      cursor.classList.add("cellCurrent-left");
    } else if (cursor.classList.contains("cellCurrent-left")) {
      cursor.classList.remove("cellCurrent-left");
      cursor.classList.add("cellCurrent-bottom");
    } else if (cursor.classList.contains("cellCurrent-bottom")) {
      cursor.classList.remove("cellCurrent-bottom");
      cursor.classList.add("cellCurrent-right");
    }
  },

  handleLaunchScriptButton: function (event) {
    // Get the value from the textarea
    event.preventDefault();
    const scriptArea = document.querySelector("#userCode");
    const script = scriptArea.value;
    console.log(script);

    // Convert it into an array to execute commands to move the arrow
    const codeLines = script.split("\n");

    // Call the codeLineLoop() method after 2 seconds with the script and a starting index of 0
    window.setTimeout(function () {
      app.codeLineLoop(codeLines, 0);
    }, 2000);
  },

  handleResetScriptButton: function (event) {
    event.preventDefault();
    const cells = document.querySelectorAll('.cell');
    const board = document.querySelector('#board');
    board.innerHTML = '';
    const scriptArea = document.querySelector("#userCode");
    scriptArea.value = '';
    cells.forEach(cell => {
      cell.classList.remove('cellStart', 'cellEnd', 'cellCurrent')
    })
    app.drawBoard();
  },

  codeLineLoop: function (codeLines, index) {
    // Getting currentLine
    var currentLine = codeLines[index];
    
    if (currentLine == "turnLeft") {
      app.turnLeft();
    } else if (currentLine == "turnRight") {
      app.turnRight();
    } else if (currentLine == "moveForward") {
      app.moveForward();
    }
    // Increment
    index++;

    // if still a line to interpret
    if (index < codeLines.length) {
      // Recall the same method (=> create a loop)
      window.setTimeout(function () {
        app.codeLineLoop(codeLines, index);
      }, 500);
    } else {
      window.setTimeout(function () {
        app.checkSuccess();
      }, 500);
    }
  },

  checkSuccess: function () {
    // Display if the game is won or not
    const cellCurrent = document.querySelector(".cellCurrent");

    if (cellCurrent.classList.contains("cellEnd")) {
      alert("YOU WIN");
    } else {
      alert("YOU LOSE");
    }
    app.handleResetScriptButton();
  },
};

document.addEventListener("DOMContentLoaded", app.init);
