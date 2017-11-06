const prompt = require('syncprompt');

module.exports = class Game {

  constructor({withAI} = {}) {
    this.currentPlayer = 'o';
    this.withAI = withAI;
    this.board = this._getEmptyBoard();
    this.currentMove = null;
  }

  play() {

    while(true) {
      this._drawBoard();

      if(this._isGameOver()) break;

      this._swapPlayer();
      this.currentMove = this._move();
    }
  }

  _getEmptyBoard() {
    //use numpad to fill in the board
    return [[null, null, null],   //[7,8,9]
            [null, null, null],   //[4,5,6]
            [null, null, null]];  //[1,2,3]
  }

  _transformToBoardCoordinates(digit) {
    let i = 3 - Math.floor((digit - 1) / 3) - 1;
    let j = (digit - 1) % 3;

    return [i,j];
  }

  _swapPlayer() {
    (this.currentPlayer === 'x') ? this.currentPlayer = 'o'
                                 : this.currentPlayer = 'x';
  }

  _drawBoard() {
    console.log(this.board.map(row => row.map(e => e || ' ').join('|'))
                                                            .join('\n'));
  }

  _getKeyboardInput() {
    let answer = prompt('Player, '+ this.currentPlayer +' make a move!\n');

    return answer;
  }

  _move() {
    let answer = this._getPlayerMove();

    const [row, col] = this._transformToBoardCoordinates(answer);

    if(this._isLegalMove(row, col)) {
      this.board[row][col] = this.currentPlayer;
      return [row, col];
    } else {
      return this._move();
    }
  }

  _getPlayerMove() {

    if(this.withAI && this.currentPlayer === 'o') {
      return this._getAIMove();
    } else {
      return this._getKeyboardInput();
    }
  }

  _isLegalMove(row, col) {

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
    console.log("Invalid character. Try numbers between 1 and 9.\n");
    return false;
  }

    //function range [1, 9]
  _getAIMove() {
    console.log("Your computer opponent makes a move...");
    const min = 1;
    const max = (this.board.length * this.board[0].length);
    return Math.floor(min + Math.random() * max);
  }

  _isWin() {
    const[row, col] = this.currentMove;
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

  _isDraw() {
    let flatBoard = [];

    this.board.map(function(e){
      flatBoard = flatBoard.concat(e);
    });

    return !flatBoard.includes(null);
  }

  _isGameOver() {

    if(!this.currentMove) return false;

    if(this._isWin()) {
      console.log(`Player ` + `${this.currentPlayer} wins!\n`);
      return true;
    } else if(this._isDraw()) {
      console.log("It's a draw!\n");
      return true;
    } else {
      return false;
    }
  }
}
