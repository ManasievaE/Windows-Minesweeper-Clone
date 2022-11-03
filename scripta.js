const grid = document.querySelector(".grid");
const bombCounter = document.querySelector("#bomb-counter");
const result = document.querySelector("#result");
const reset = document.querySelector("#reset");
const timer = document.querySelector("#timer");

let width = 10;
let bombAmount = 20;
let time = 600;
let flags = 0;
let squares = [];
let isGameOver = false;

//create Board
function createBoard() {
  const sol = new solution();

  bombCounter.innerHTML = "0" + bombAmount;
  timer.innerHTML = time + "s";

  //put bombs on random squares inside the board
  const bombsArray = Array(bombAmount).fill("bomb");
  const emptyArray = Array(width * width - bombAmount).fill("not-bomb");
  const gameArray = emptyArray.concat(bombsArray);
  const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");

    square.setAttribute("id", i);
    square.classList.add(shuffledArray[i]);
    grid.appendChild(square);
    squares.push(square);

    //normal click
    square.addEventListener("click", function (e) {
      sol.clicking(square);
    });

    //right click
    square.oncontextmenu = function (e) {
      e.preventDefault();
      sol.flaging(square);
    };
  }

  //add numbers
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;

    if (squares[i].classList.contains("not-bomb")) {
      //left
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
        total++;
      //up-right
      if (
        i > 9 &&
        !isRightEdge &&
        squares[i + 1 - width].classList.contains("bomb")
      )
        total++;
      // up
      if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
      //up left
      if (
        i > 11 &&
        !isLeftEdge &&
        squares[i - 1 - width].classList.contains("bomb")
      )
        total++;
      // right
      if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
        total++;
      // down left
      if (
        i < 90 &&
        !isLeftEdge &&
        squares[i - 1 + width].classList.contains("bomb")
      )
        total++;
      //down right
      if (
        i < 88 &&
        !isRightEdge &&
        squares[i + 1 + width].classList.contains("bomb")
      )
        total++;
      //down
      if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
      squares[i].setAttribute("data", total);
    }
  }
}
//createBoard();

//add flag with right click

function solution() {
  let logic = msLogic();
  let solver = [];
  const flagPic = '<img src="imgs/flag.png">';
  solver.flaging = function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = flagPic;
        flags++;
        bombCounter.innerHTML = "0" + bombAmount - flags;
        logic.gameIsWon();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
        bombCounter.innerHTML = "0" + bombAmount - flags;
      }
    }
  };

  //click on square
  solver.clicking = function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      logic.gameIsOver(square);
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        if (total == 5) square.classList.add("five");
        if (total == 6) square.classList.add("six");
        if (total == 7) square.classList.add("seven");
        if (total == 8) square.classList.add("eight");

        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  };

  //when square is clicked, check squares around it

  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId >= 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        solver.clicking(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        solver.clicking(newSquare);
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId - width)].id;
        const newSquare = document.getElementById(newId);
        solver.clicking(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        solver.clicking(newSquare);
      }
      if (currentId <= 99 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        solver.clicking(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        solver.clicking(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        solver.clicking(newSquare);
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        solver.clicking(newSquare);
      }
    }, 10);
  }
  //TIMER
  solver.timerr = function timeCount() {
    setTimeout(function () {
      if (isGameOver || time === 0) return logic.gameIsOver();
      timer.innerHTML = time;
      time--;
      timeCount();
    }, 1000);
  };
  return solver;
}

function msLogic() {
  let logic = [];
  const bombPic = '<img src="imgs/bomb.png">';
  const coolFace = '<img src="imgs/cool-face.png">';
  const deadFace = '<img src="imgs/dead-face.png">';

  //game over
  logic.gameIsOver = function gameOver(square) {
    document.getElementById("reset").innerHTML = deadFace;
    if (time === 0) result.innerHTML = "Time Up!!!";
    else result.innerHTML = "Game Over!";
    isGameOver = true;

    //show ALL the bombs
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = bombPic;
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
  };

  //check for win
  logic.gameIsWon = function gameWon() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        document.getElementById("reset").innerHTML = coolFace;
        result.innerHTML = "YOU WON!";
        isGameOver = true;
      }
    }
  };
  return logic;
}

function uI() {
  const sol = new solution();
  const smileyFace = '<img src="imgs/smiley-face.png">';

  ///RESET BUTTON
  reset.addEventListener("click", function () {
    isGameOver = false;
    squares = [];
    flags = 0;
    time = 600;
    reset.innerHTML = smileyFace;
    result.innerHTML = "";
    grid.innerHTML = "";
    createBoard();
    sol.flaging();
    sol.timerr();
  });
}

createBoard();
uI();
const sol = new solution();
sol.timerr();
sol.flaging();
sol.clicking();
