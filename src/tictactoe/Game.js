const prompt = require('syncprompt');

module.exports = class Game {

  constructor() {

    this.board = null;

    this.currentPlayer = 'x';

    this.aI = false;

    this.squaresLeft;

  }

  Board() {
    //use numpad to fill in the board
    return [[null, null, null],   //[7,8,9]
            [null, null, null],   //[4,5,6]
            [null, null, null]];  //[1,2,3]
  }

  start() {

    let greetings = '*TICTACTOE* \nHit 1 to play against a dumb-ass AI \n' +
                    'Hit 2 for two-player mode \nHit 0 to quit\n';

    this.board = this.Board();
    this.squaresLeft = 9;

    switch(prompt(greetings)) {
      case '0':
        process.exit();
        break;

      case '1':
        this.aI = true;
        this.nextMove();
        break;

      case '2':
        this.aI = false;
        this.nextMove();
        break;

      default:
        this.start();
        break;
    }
  }

  nextPlayer() {
    (this.currentPlayer === 'x') ? this.currentPlayer = 'o'
                                 : this.currentPlayer = 'x';

    return this.currentPlayer;
  }

  drawBoard() {

    console.log(this.board.map(row => row.map(e => e || ' ').join('|'))
                                                            .join('\n'));
  }

  nextMove() {

    this.drawBoard();

    while(true) {

      let answer = prompt('Player, '+ this.currentPlayer +' make a move!\n');

      let i = 3 - Math.floor((answer - 1) / 3) - 1;
      let j = (answer - 1) % 3;

      let aIPosition = [null, null];

      if(this.checkLegalMove(i,j)) {
        this.board[i][j] = this.currentPlayer;
        this.squaresLeft -= 1;

        this.checkEndgame(i, j);

        if(this.aI) {
          this.currentPlayer = this.nextPlayer();

          aIPosition = this.aIMove();

          this.checkEndgame(aIPosition[0], aIPosition[1]);

          this.currentPlayer = this.nextPlayer();
        } else {
          this.currentPlayer = this.nextPlayer();
        }

        this.nextMove();

      } else {
        this.nextMove();
      }
    }
  }

  checkLegalMove(row, col) {

    if(isFinite(row) && isFinite(col)) {
      if((row < 0 || row >= this.board.length) ||
        (col < 0 || col >= this.board[row].length)) {
        console.log('Out of bounds, try another position\n');

        return false;
      }

      if(this.board[row][col]) {
        console.log('Cell occupied, try another position\n');

        return false;
      }
      return true;
    }
    console.log("Invalid character. Try numbers between 1 and 9.\n")
    return false;
  }

  aIMove() {

    let rndI = Math.floor(Math.random() * this.board.length);

    let rndJ = Math.floor(Math.random() * this.board[rndI].length);

    if (this.board[rndI][rndJ] !== 'x' && this.board[rndI][rndJ] !== 'o') {

      this.board[rndI][rndJ] = this.currentPlayer;
      this.squaresLeft -= 1;

    } else if (this.squaresLeft > 0){
        this.aIMove();
    } else {

    }
    return [rndI,rndJ];
  }

  isWin(row, col) {

    let win;
    let lines = [];
    let board = this.board;
    let currentPlayer = this.currentPlayer;
    let leftDiagonal = [[0,0], [1,1], [2,2]];
    let rightDiagonal = [[2,0], [1,1], [0,2]];

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

  isDraw() {
    let flatBoard = [];

    for(let i = 0; i < this.board.length; i++) {
      flatBoard = flatBoard.concat(this.board[i]);
    }

    if(!(flatBoard.includes(null))) {
        return true;
      } else {
        return false;
    }
  }

  checkEndgame(row, col) {
    if(this.isWin(row, col)) {

      this.drawBoard();
      console.log(`Player ` + `${this.currentPlayer} wins!\n`);
      this.start();

    } else if(this.isDraw()) {

      this.drawBoard();
      console.log("It's a draw!\n");
      this.start();

    } else {

    }
  }
}
