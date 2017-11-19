const prompt = require('syncprompt');
const Board = require('./Board');
const BoardInvalidRequest = require('./BoardInvalidRequest');

module.exports = class Game {

  constructor({withAI = false} = {}) {
    this.currentPlayer = 'o';
    this.withAI = withAI;
    this.board = new Board();
  }

  play() {
    while(true) {
      this._drawBoard();

      if(this._isGameOver()) break;

      this._swapPlayer();
      this._move();
    }
  }

  _swapPlayer() {
    (this.currentPlayer === 'x') ? this.currentPlayer = 'o'
                                 : this.currentPlayer = 'x';
  }

  _drawBoard() {
    console.log(this.board.toString()+"\n");
  }

  _getKeyboardInput() {
    return prompt('Player, '+ this.currentPlayer +' make a move!\n');
  }

  _move() {
    try {
      this.board.occupyPosition(this._getPlayerMove(), this.currentPlayer);
    } catch (e) {
      if(e instanceof BoardInvalidRequest) {
        this._move();
      } else {
        throw e;
      }
    }
  }

  _getPlayerMove() {
    return (this.withAI && this.currentPlayer === 'o')
    ? this._getAIMove() : this._getKeyboardInput();
  }

    //function range [1, 9]
  _getAIMove() {
    const min = this.board.getLowerPositionRangeBoundary();
    const max = this.board.getUpperPositionRangeBoundary();
    return Math.floor(min + Math.random() * max);
  }

  _isWin(){
    let currentPlayer = this.currentPlayer;
    return this.board.getWinLines().some(function(winLine) {
      return winLine.every(function(cell) {
        return cell === currentPlayer;
      });
    });
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
