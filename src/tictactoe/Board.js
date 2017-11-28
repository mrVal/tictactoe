const BoardInvalidRequest = require('./BoardInvalidRequest');

module.exports = class Board{

  constructor () {
    //use numpad to fill in the board
    this._matrix = [[null, null, null], // [7, 8, 9]
                    [null, null, null], // [4, 5, 6]
                    [null, null, null]];// [1, 2, 3]
  }

  getMarkFromBoard(position) {

    const [row, col] = this._transformToBoardCoords(position);

    if(!this._isBoardPosition(row, col))
      throw new BoardInvalidRequest('Out of board range');

    return this._matrix[row][col];
  }

  setMarkOnBoard(position, mark) {
    if(!this._isValidMark(mark))
      throw new BoardInvalidRequest('Invalid Mark');

    const [row, col] = this._transformToBoardCoords(position);

    if(this.getMarkFromBoard(position))
      throw new BoardInvalidRequest("Position is occupied");

    this._matrix[row][col] = mark;
  }

  toString() {
    return this._matrix.map(row => row.map(cell => cell || ' ')
                                                               .join('|'))
                                                               .join('\n');
  }

  isFull() {
    return !this._getFlattenedMatrix().includes(null);
  }

  get upperPositionRangeBoundary() {
    return this._getFlattenedMatrix().length;
  }

  get lowerPositionRangeBoundary() {
     return 1;
  }

  getWinLines() {

    let winLines = []

    winLines.push(this._getRightDiagonal(), this._getLeftDiagonal(),
                  this._matrix[0], this._matrix[1], this._matrix[2],
                  this._getColumn(0), this._getColumn(1), this._getColumn(2));

    return winLines;
  }

  _transformToBoardCoords(position){
    let row = 3 - Math.floor((position - 1) / 3) - 1;
    let col = (position - 1) % 3;

    return [row,col];
  }

  _isValidMark(mark) {
    return mark ==='x' || mark === 'o';
  }

  _isBoardPosition(row, col) {
    return Number.isInteger(row) && (row >= 0 && row < this._matrix.length) &&
           Number.isInteger(col) && (col >= 0 && col < this._matrix[row].length)
  }

  _isOccupied(row, col) {
    return !!this._matrix[row][col];
  }

  _getFlattenedMatrix() {
    return this._matrix.reduce((acc, curr) => acc.concat(curr));
  }

  _getColumn(col) {
    let column = [];

    this._matrix.map(e => column = column.concat(e[col]));

    return column;
  }

  //works for square matrices only
  _getRightDiagonal() {
    let rDiag = [];
    let topRight = this._matrix[0].length -1;

    this._matrix.reduce((previous, current, index) => {
      rDiag.push(current[topRight - index]);
    }, 0);

    return rDiag;
  }

  //works for square matrices only
  _getLeftDiagonal() {
    let lDiag = [];
    let topLeft = 0;

    this._matrix.reduce((previous, current, index) => {
      lDiag.push(current[topLeft + index]);
      }, 0);

    return lDiag;
  }
}
