var app = {
  init: function () {
    console.log("init");

    // TODO
    app.drawBoard();

    // Event listeners - TODO
    const launchScript = document.querySelector("#launchScript");
    launchScript.addEventListener("click", app.handleLaunchScriptButton);
    resetScript.addEventListener("click", app.handleResetScriptButton);
  },

  drawBoard: function () {
    // création de la grille
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

    // Case de départ aléatoire avec le curseur
    const cells = document.querySelectorAll('.cell');
    console.log(cells)
    let cellStartRandom = Math.floor(Math.random() * cells.length);
    const randomStart = cells[cellStartRandom];
    randomStart.classList.add("cellStart")

    // La fléche est sur le départ
    randomStart.classList.add("cellCurrent");
    randomStart.classList.add("cellCurrent-right");

    // la case d'arrivée
    let cellEndRandom = Math.floor(Math.random() * cells.length);
    const randomEnd = cells[cellEndRandom];
    randomEnd.classList.add("cellEnd")
  },

  moveForward: function () {
    const cellCurrent = document.querySelector(".cellCurrent");

    // dans quelle direction est le curseur
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
        if (!cell.classList.contains("cellEnd")) {
          cellCurrent.classList.remove("cellCurrent", "cellCurrent-top");
          cell.classList.add("cellCurrent", "cellCurrent-top");
        }
      } else {
        alert("Tu es sorti de la grille !");
      }
    } else if (bottom) {
      const currentRow = cellCurrent.parentElement;
      const nextRow = currentRow.nextElementSibling;
      if (nextRow) {
        const cells = nextRow.querySelectorAll(".cell");
        const cell = cells[cellCurrent.dataset.column];
        if (!cell.classList.contains("cellEnd")) {
          cellCurrent.classList.remove("cellCurrent", "cellCurrent-bottom");
          cell.classList.add("cellCurrent", "cellCurrent-bottom");
        }
      } else {
        alert("Tu es sorti de la grille !");
      }
    } else if (right) {
      const nextCell = cellCurrent.nextElementSibling;
      if (nextCell) {
        if (!nextCell.classList.contains("cellEnd")) {
          cellCurrent.classList.remove("cellCurrent", "cellCurrent-right");
          nextCell.classList.add("cellCurrent", "cellCurrent-right");
        }
      } else {
        alert("Tu es sorti de la grille !");
      }
    } else if (left) {
      const previousCell = cellCurrent.previousElementSibling;
      if (previousCell) {
        if (!previousCell.classList.contains("cellEnd")) {
          cellCurrent.classList.remove("cellCurrent", "cellCurrent-left");
          previousCell.classList.add("cellCurrent", "cellCurrent-left");
        }
      } else {
        alert("Tu es sorti de la grille !");
      }
    }
  },

  turnRight: function () {
    const curseur = document.querySelector(".cellCurrent");
    if (curseur.classList.contains("cellCurrent-right")) {
      curseur.classList.remove("cellCurrent-right");
      curseur.classList.add("cellCurrent-bottom");
    } else if (curseur.classList.contains("cellCurrent-bottom")) {
      curseur.classList.remove("cellCurrent-bottom");
      curseur.classList.add("cellCurrent-left");
    } else if (curseur.classList.contains("cellCurrent-left")) {
      curseur.classList.remove("cellCurrent-left");
      curseur.classList.add("cellCurrent-top");
    } else if (curseur.classList.contains("cellCurrent-top")) {
      curseur.classList.remove("cellCurrent-top");
      curseur.classList.add("cellCurrent-right");
    }
  },

  turnLeft: function () {
    const curseur = document.querySelector(".cellCurrent");
    if (curseur.classList.contains("cellCurrent-right")) {
      curseur.classList.remove("cellCurrent-right");
      curseur.classList.add("cellCurrent-top");
    } else if (curseur.classList.contains("cellCurrent-top")) {
      curseur.classList.remove("cellCurrent-top");
      curseur.classList.add("cellCurrent-left");
    } else if (curseur.classList.contains("cellCurrent-left")) {
      curseur.classList.remove("cellCurrent-left");
      curseur.classList.add("cellCurrent-bottom");
    } else if (curseur.classList.contains("cellCurrent-bottom")) {
      curseur.classList.remove("cellCurrent-bottom");
      curseur.classList.add("cellCurrent-right");
    }
  },

  handleLaunchScriptButton: function (event) {
    // TODO
    // on recup la valeur de textarea
    event.preventDefault();
    const scriptArea = document.querySelector("#userCode");
    const script = scriptArea.value;
    console.log(script);

    // TODO : get all lines as an array
    // on le convertie  en tableau pour passer les commandes pour faire bouger la flèche
    const codeLines = script.split("\n");

    // Appel, après 2sec, la méthode codeLineLoop() avec la variable et l'index de départ (0)
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
    console.log(currentLine);
    console.log(index);

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
      // Recall same method (=> make a loop)
      window.setTimeout(function () {
        app.codeLineLoop(codeLines, index);
      }, 1000);
    } else {
      window.setTimeout(function () {
        app.checkSuccess();
      }, 1000);
    }
  },

  checkSuccess: function () {
    // TODO display if the game is won or not
    const cellCurrent = document.querySelector(".cellCurrent");

    const row4 = document.querySelector("#row3");
    const finish = row4.lastChild;

    if (finish.classList.contains("cellCurrent", "cellEnd")) {
      alert("YOU WIN");
    } else {
      alert("YOU LOSE");
    }
  },
};

document.addEventListener("DOMContentLoaded", app.init);
