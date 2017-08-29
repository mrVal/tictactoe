const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const board = [[null, null, null],
               [null, null, null],
               [null, null, null]];

const leftDiagonal = [[0,0], [1,1], [2,2]];
const rightDiagonal = [[2,0], [1,1], [0,2]];

let currentPlayer = 'x';

let aI = false;

let squaresLeft = 9;

let greetings = '*TICTACTOE* \nHit 1 to play against a dumb-ass AI \nHit 2 for two-player mode \n';

function startGame() {

  rl.question(greetings, function(answer) {
      switch(answer) {

        case '1':
          aI = true;
          nextMove();
          break;

        case '2':
          nextMove();
          break;

        default:
          startGame();
          break;
      }
  });
}

function nextPlayer() {
  (currentPlayer === 'x') ? currentPlayer = 'o': currentPlayer = 'x';

  return currentPlayer;
}

function drawBoard() {

  console.log(board.map(row => row.map(e => e || ' ').join('|')).join('\n'));
}

function nextMove() {

  drawBoard();

  rl.question('Player, '+ currentPlayer +' make a move!\n',
              function (answer) {
    let i = 3 - Math.floor((answer - 1) / 3) - 1;
    let j = (answer - 1) % 3;

    if(checkLegalMove(i,j)) {
      board[i][j] = currentPlayer;
      squaresLeft -= 1;

      checkEndgame(i, j);

      if(aI) {
        currentPlayer = nextPlayer();

        [aIRow, aICol] = aIMove();


        checkEndgame(aIRow, aICol);

        currentPlayer = nextPlayer();
      } else {
        currentPlayer = nextPlayer();
      }

      nextMove();

    } else {
      nextMove();
    }
  });
}

function checkLegalMove(row, col) {

  if(isFinite(row) && isFinite(col)) {
    if((row < 0 || row >= board.length) ||
      (col < 0 || col >= board[row].length)) {
      console.log('Out of bounds, try another position\n');

      return false;
    }

    if(board[row][col]) {
      console.log('Cell occupied, try another position\n');

      return false;
    }
    return true;
  }
  console.log("Invalid character. Try numbers between 1 and 9.\n")
  return false;
}

function aIMove() {

    let rndI = Math.floor(Math.random() * board.length);

    let rndJ = Math.floor(Math.random() * board[rndI].length);

    if (board[rndI][rndJ] !== 'x' && board[rndI][rndJ] !== 'o') {

      board[rndI][rndJ] = currentPlayer;
      squaresLeft -= 1;

    } else if (squaresLeft > 0){
        aIMove();
    } else {

    }
    return [rndI,rndJ];
}

function isWin(row, col) {

  let win;
  let lines = [];

  [leftDiagonal, rightDiagonal].map(function(line) {
    line.map(function(cell) {
      if(cell[0] === row && cell[1] === col) {
        lines.push(line);
      }
    })
  });

  lines.push([0, 1, 2].map(function(c1) {
    return [row, c1];
  }));

  lines.push([0, 1, 2].map(function(r1) {
    return [r1, col];
  }));

  win = lines.some(function(line) {
    return line.every(function(cell) {
      return board[cell[0]][cell[1]] === currentPlayer;
    });
  });

  return win;
}

function isDraw() {
  let flatBoard = [];

  for(let i = 0; i < board.length; i++) {
    flatBoard = flatBoard.concat(board[i]);
  }

  if(!(flatBoard.includes(null))) {
      return true;
    } else {
      return false;
  }
}

function checkEndgame(row, col) {
  if(isWin(row, col)) {

    drawBoard();
    console.log(`Player ` + `${currentPlayer} wins!\n`);
    process.exit();

  } else if(isDraw()) {

    drawBoard();
    console.log("It's a draw!\n");
    process.exit();

  } else {

  }
}

startGame();