const prompt = require('syncprompt');

module.exports = class Player {
  constructor(mark, aI = false) {
    this._mark = mark;
    this._AI = aI;
  }

  getInput() {
    return this._AI ? this._getRandomNumber() : this._getKeyboardInput();
  }

  getMark() {
    return this._mark;
  }

    //function range [1, 9]
  _getRandomNumber() {
    const min = this.board.lowerPositionRangeBoundary;
    const max = this.board.upperPositionRangeBoundary;
    return Math.floor(min + Math.random() * max);
  }

  _getKeyboardInput() {
    return prompt('Player, '+ this.getMark() +' make a move!\n');
  }
}
