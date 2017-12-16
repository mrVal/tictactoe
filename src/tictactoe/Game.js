const prompt = require('syncprompt');
const Board = require('./Board');
const BoardInvalidRequest = require('./BoardInvalidRequest');
const {display, displayError, displayWin} = require('./utils/display');
const Cycle = require('./utils/Cycle');
const Player = require('./Player');

module.exports = class Game {

  constructor({withAI = false} = {}) {
    this._withAI = withAI;
    this._board = new Board();

    this._players = new Cycle([new Player('x'), new Player('o', this._withAI)]);
    this.currentPlayer = this._players.getDefaultPlayer();
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

      this.currentPlayer = this._players.next();
      this._move();
    }
  }

  _drawBoard() {
    display(this.board);
  }

  _move() {

    try {
      this.board.setMarkOnBoard(this.currentPlayer.getInput(),
                                this.currentPlayer.getMark());
    } catch (e) {
      if(e instanceof BoardInvalidRequest) {
        displayError(e.name + ' : ' + e.message);
        this._move();
      } else {
        throw e;
      }
    }
  }

  _isWin(){
    return this.board.getWinLines().some(winLine =>
      winLine.every(cell => cell === this.currentPlayer.getMark()));
  }

  _isDraw() {
    return this.board.isFull();
  }

  _isGameOver() {

    if(this._isWin()) {
      displayWin(`Player ${this.currentPlayer.getMark()} wins!\n`);
      return true;
    } else if(this._isDraw()) {
      display(`It's a draw!\n`);
      return true;
    } else {
      return false;
    }
  }
}
