(function() {
  "use strict";

  let field = [];

  let width = '';
  let height = '';
  let speed = '';
  let stopGen = '';

  let countSteps = 1
  let countGeneration = 1;
  let aliveCount = 0;
  let cellSize = 12;

  let timerId;
  let mouse;
  let canvas;

  let startBtn = document.getElementById("startBtn");
  let createtBtn = document.getElementById("createBtn");

  function createStartField () {
    stopGame();

    field = [];
    countGeneration = 1;
    aliveCount = 0;

    document.getElementById('stepCount').innerHTML = countSteps

    width = document.getElementById("inputWidth").value;
    height = document.getElementById("inputHeight").value;
    cellSize = document.getElementById("cellSize").value;
    speed = document.getElementById("inputSpeed").value;
    stopGen = document.getElementById("inputGen").value;

    createCanvas();

    if (document.getElementById("random-input").checked) {
      createRandomFieldCell();
    } else if (document.getElementById("grid-input").checked) {
      createGridFieldCell();
    }  else if (document.getElementById("empty-input").checked) {
      createEmptyCell();
    }
    document.getElementById("aliveCount").innerHTML = aliveCount;
  }

  function createRandomFieldCell () {
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        const cell = { isAlive: Math.random() > 0.9 ? 1 : 0 }
        row.push(cell);
        cell.isAlive ? aliveCount ++ : '';
        fillCellCanvas(x, y, cell.isAlive);
      }
      field.push(row);
    }
  }

  function createGridFieldCell () {
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        let cell = { isAlive: 0 }
        if (!(y % 3 === 0 || x % 3 === 0)) {
          cell.isAlive = 1;
          aliveCount++;
        }
        if (Math.floor(height / 2) === y && Math.floor(width / 2) === x) {
          cell.isAlive = cell.isAlive ? 0 : 1;
        }
        row.push(cell);
        fillCellCanvas(x, y, cell.isAlive)
      }
      field.push(row);
    }
  }

  function createEmptyCell () {
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        row.push({ isAlive: false });
        fillCellCanvas(x, y, false)
      }
      field.push(row);
    }
  }

  function createNextGeneration () {
    aliveCount = 0;
    let newField = JSON.parse(JSON.stringify(field));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {

        let countLiveCell = 0;
        const minusY = y - 1 < 0 ? height - 1 : y - 1;
        const addY = y + 1 >= height ? 0 : y + 1;
        const minusX = x - 1 < 0 ? width - 1 : x - 1;
        const addX = x + 1 >= width ? 0 : x + 1;

        countLiveCell += field[minusY][minusX].isAlive + field[minusY][x].isAlive + field[minusY][addX].isAlive;
        countLiveCell += field[y][minusX].isAlive + field[y][addX].isAlive;
        countLiveCell += field[addY][minusX].isAlive + field[addY][x].isAlive + field[addY][addX].isAlive;

        if (field[y][x].isAlive) {
          if (countLiveCell !== 2 && countLiveCell !== 3) {
            newField[y][x].isAlive = 0;
          }
        } else if (countLiveCell === 3) {
          aliveCount++;
          newField[y][x].isAlive = 1;
        }
        if (newField[y][x].isAlive !== field[y][x].isAlive) {
          fillCellCanvas(x, y, newField[y][x].isAlive);
        }
      }
    }
    field = newField;

    countGeneration += 1;

    if (countGeneration >= stopGen * countSteps) {
      countSteps++;
      stopGame();
    }
    document.getElementById('stepCount').innerHTML = countGeneration
    document.getElementById('aliveCount').innerHTML = aliveCount
  }

  function createCanvas () {
    let fieldDiv = document.getElementById('field');
    fieldDiv.innerHTML = '';

    let canvasField = document.createElement('canvas');
    canvasField.id = "canvas";
    canvasField.width = width * cellSize;
    canvasField.height = height * cellSize;

    fieldDiv.appendChild(canvasField);
    canvas = canvasField.getContext('2d');

    canvasField.addEventListener("click", function(event) {
        mouse = oMousePos(canvasField, event);
        const x = Math.floor(mouse.x / cellSize);
        const y = Math.floor(mouse.y / cellSize);

        field[y][x].isAlive = field[y][x].isAlive ? 0 : 1;
        field[y][x].isAlive ? aliveCount++ : aliveCount--;
        document.getElementById("aliveCount").innerHTML = aliveCount;
        fillCellCanvas(x, y, field[y][x].isAlive);
      }
    );
  }

  function oMousePos(canvas, evt) {
    const ClientRect = canvas.getBoundingClientRect();
    return {
      x: Math.round(evt.clientX - ClientRect.left),
      y: Math.round(evt.clientY - ClientRect.top)
    }
  }

  function fillCellCanvas (x, y, isAlive) {
    if (isAlive) {
      canvas.fillStyle = "#383838";
      canvas.fillRect(x * cellSize,y * cellSize,cellSize,cellSize);
    } else {
      canvas.fillStyle = "#ffffff";
      canvas.fillRect(x * cellSize,y * cellSize,cellSize,cellSize);
    }
    canvas.strokeStyle = "#959595";
    canvas.lineWidth = 0.5;
    canvas.strokeRect(x * cellSize,y * cellSize,cellSize,cellSize);
  }

  function startGame () {
    speed = document.getElementById("inputSpeed").value;
    stopGen = document.getElementById("inputGen").value;

    startBtn.innerText = 'STOP';
    startBtn.removeEventListener("click", startGame);
    startBtn.addEventListener("click", stopGame);

    timerId = setInterval(createNextGeneration, speed);
  }

  function stopGame () {
    clearInterval(timerId);

    startBtn.innerText = 'START';
    startBtn.removeEventListener("click", stopGame);
    startBtn.addEventListener("click", startGame);
  }

  createtBtn.addEventListener("click", createStartField);
  startBtn.addEventListener("click", startGame);

  createStartField();

}());

