const prompt = require('syncprompt');
const Board = require('./Board');
const BoardInvalidRequest = require('./BoardInvalidRequest');

module.exports = class Game {

  constructor({withAI} = {}) {
    this.currentPlayer = 'o';
    this.withAI = withAI;
    this.board = new Board();
    this.currentMove = null;
  }

  play() {
    while(true) {
      this._drawBoard();

      if(this._isGameOver()) break;

      this._swapPlayer();
      debugger;
      this._move();
    }
  }

  _swapPlayer() {
    (this.currentPlayer === 'x') ? this.currentPlayer = 'o'
                                 : this.currentPlayer = 'x';
  }

  _drawBoard() {
    console.log(this.board.toString());
  }

  _getKeyboardInput() {
    let answer = prompt('Player, '+ this.currentPlayer +' make a move!\n');
    return answer;
  }

  _move() {
    let playerMove = this._getPlayerMove();
    try {
      this.board.occupyPosition(playerMove, this.currentPlayer);
    } catch (e) {
      if(e instanceof BoardInvalidRequest) {
        this._move();
      } else {
        throw e;
      }
    }
  }

  _getPlayerMove() {
    if(this.withAI && this.currentPlayer === 'o') {
      return this._getAIMove();
    } else {
      return this._getKeyboardInput();
    }
  }

    //function range [1, 9]
  _getAIMove() {
    console.log("Your computer opponent makes a move...");
    const min = this.board.getLowerPositionRangeBoundary();
    const max = this.board.getUpperPositionRangeBoundary();
    return Math.floor(min + Math.random() * max);
  }

  _isWin(){
    let currentPlayer = this.currentPlayer;
    let win = this.board.getWinLines().some(function(winLine) {
      return winLine.every(function(cell) {
        return cell === currentPlayer;
      });
    });

    return win;
  }

  _isDraw() {
    return this.board.isFull();
  }

  _isGameOver() {

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
