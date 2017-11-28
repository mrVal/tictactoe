const prompt = require('syncprompt');
const Board = require('./Board');
const BoardInvalidRequest = require('./BoardInvalidRequest');

module.exports = class Game {

  constructor({withAI = false} = {}) {
    this._currentPlayer = 'o';
    this._withAI = withAI;
    this._board = new Board();
  }

  get currentPlayer() { return this._currentPlayer; }
  get withAI() { return this._withAI; }
  get board() { return this._board; }

  set currentPlayer(player) {
    this._currentPlayer = player;
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
    this.currentPlayer = (this.currentPlayer === 'x') ? 'o' : 'x';
  }

  _drawBoard() {
    console.log(`${this.board}\n`);
  }

  _getKeyboardInput() {
    return prompt('Player, '+ this.currentPlayer +' make a move!\n');
  }

  _move() {
    try {
      this.board.setMarkOnBoard(this._getPlayerMove(), this.currentPlayer);
    } catch (e) {
      if(e instanceof BoardInvalidRequest) {
        console.log(e.name + ' : ' + e.message);
        this._move();
      } else {
        throw e;
      }
    }
  }

  _getPlayerMove() {
    return this.withAI && this.currentPlayer === 'o'
           ? this._getAIMove()
           : this._getKeyboardInput();
  }

    //function range [1, 9]
  _getAIMove() {
    const min = this.board.lowerPositionRangeBoundary;
    const max = this.board.upperPositionRangeBoundary;
    return Math.floor(min + Math.random() * max);
  }

  _isWin(){
    return this.board.getWinLines().some(winLine =>
      winLine.every(cell => cell === this.currentPlayer));
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
