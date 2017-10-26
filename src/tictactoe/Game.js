const prompt = require('syncprompt');

module.exports = class Game {

  constructor() {
    this.board = null;
    this.currentPlayer = 'x';
    this.aI = false;
    this.squaresLeft = 9;
    this.board = this._getEmptyBoard();
  }

  play(useAI) {

    while(true) {
      this._drawBoard();
      const [row, col] = this._playerMove();

      if(!this._isLegalMove(row, col)) continue;

        this.board[row][col] = this.currentPlayer;
        this._reduceFreeSquaresNumber();

      if(this._isGameOver(row, col)) break;

      this._swapPlayer();

      if(useAI) {
        const [aIRow, aICol] = this._getAIMove();

        if(this._isGameOver(aIRow, aICol)) break;

        this._swapPlayer()
      }
    }
  }

  _getEmptyBoard() {
    //use numpad to fill in the board
    return [[null, null, null],   //[7,8,9]
            [null, null, null],   //[4,5,6]
            [null, null, null]];  //[1,2,3]
  }

  _reduceFreeSquaresNumber() {
    this.squaresLeft -= 1;
  }

  _swapPlayer() {
    (this.currentPlayer === 'x') ? this.currentPlayer = 'o'
                                 : this.currentPlayer = 'x';
  }

  _drawBoard() {
    console.log(this.board.map(row => row.map(e => e || ' ').join('|'))
                                                            .join('\n'));
  }

  _playerMove() {
    let answer = prompt('Player, '+ this.currentPlayer +' make a move!\n');
    let i = 3 - Math.floor((answer - 1) / 3) - 1;
    let j = (answer - 1) % 3;

    return [i,j];
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

  _getAIMove() {
    let rndI = Math.floor(Math.random() * this.board.length);
    let rndJ = Math.floor(Math.random() * this.board[rndI].length);

    if(this.board[rndI][rndJ] !== 'x' && this.board[rndI][rndJ] !== 'o') {
      this.board[rndI][rndJ] = this.currentPlayer;
      this._reduceFreeSquaresNumber();
    } else if (this.squaresLeft > 0){
      this._getAIMove();
    }

    return [rndI,rndJ];
  }

  _isWin(row, col) {
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

    for(let i = 0; i < this.board.length; i++) {
      flatBoard = flatBoard.concat(this.board[i]);
    }

    return !flatBoard.includes(null);
  }

  _isGameOver(row, col) {

    if(this._isWin(row, col)) {
      this._drawBoard();
      console.log(`Player ` + `${this.currentPlayer} wins!\n`);
      return true;
    } else if(this._isDraw()) {
      this._drawBoard();
      console.log("It's a draw!\n");
      return true;
    }
  }
}
