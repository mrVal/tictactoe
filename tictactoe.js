const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
  output: process.stdout,
});


const board = [[7, 8, 9],
               [4, 5, 6],
               [1, 2, 3]];

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

  s = s.replace(new RegExp('1|2|3|4|5|6|7|8|9','g'),' ');

  console.log(s);
}

function nextMove() {
  rl.question('Player, '+ currentPlayer +' make a move!\n',
              function checkInput(answer) {
    board.forEach(function(item, i) {
      item.forEach(function(item, j) {
        if (Number(answer) === item) {
          board[i][j] = currentPlayer;

          squaresLeft -= 1;

          if (aI) {
            aIMove();
          } else {
            currentPlayer = nextPlayer();
          }
        }
      });
    });
  drawBoard();

  nextMove();
  });
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
