const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const board = [[null, null, null],
               [null, null, null],
               [null, null, null]];

let currentPlayer = 'x';

let aI = false;

let squaresLeft = 9;

let greetings = '*TICTACTOE* \nHit 1 to play against a dumb-ass AI \nHit 2 for two-player mode\n';

function startGame() {
  rl.question(greetings, function(answer) {
      switch(answer) {
        case '1':
          aI = true;
          drawBoard();
          nextMove();
          break;

        case '2':
          drawBoard();
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

  let s = (board.join('\n').replace(new RegExp(',','g'),'|'));

  console.log(s);
}

function nextMove() {
  rl.question('Player, '+ currentPlayer +' make a move!\n',
              function (answer) {
    let i = 3 - Math.floor((answer - 1) / 3) - 1;
    let j = (answer - 1) % 3;

    if(checkLegalMove(i,j)) {
      board[i][j] = currentPlayer;
      squaresLeft -= 1;

      if (aI) {
        aIMove();
      } else {
        currentPlayer = nextPlayer();
      }

      drawBoard();
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
      currentPlayer = nextPlayer();

      board[rndI][rndJ] = currentPlayer;
      squaresLeft -= 1;

      currentPlayer = nextPlayer();

    } else if (squaresLeft > 0){
        aIMove();
    } else {
        console.log('Game over!\n');
    }
}

startGame();
