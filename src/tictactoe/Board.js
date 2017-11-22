const BoardInvalidRequest = require('./BoardInvalidRequest');

module.exports = class Board{

  constructor () {
    this._matrix = [[null, null, null],
                    [null, null, null],
                    [null, null, null]];
  }

  _transformToMatrixCoord(position){
    let i = 3 - Math.floor((position - 1) / 3) - 1;
    let j = (position - 1) % 3;

    return [i,j];
  }

  _isValidMark(mark) {
    return ((mark ==='x') || (mark === 'o'));
  }

  _isBoardPosition(row, col) {
    if((Number.isInteger(row) && Number.isInteger(col)) &&
       (row >= 0 && row < this._matrix.length) &&
       (col >= 0 && col < this._matrix[row].length)) {
      return true;
    }

    return false;
  }

  _isOccupied(row, col) {
    return (this._matrix[row][col]);
  }

  _getFlattenedMatrix() {
    return this._matrix.reduce(function(acc, curr) {
      return acc.concat(curr);
    });
  }

  _getColumn(col) {
    let column = [];

    this._matrix.map(function(e){
      column = column.concat(e[col]);
    });

    return column;
  }

  _getRightDiagonal(){
    let rDiag = [];
    rDiag.push(this._matrix[2][0]);
    rDiag.push(this._matrix[1][1]);
    rDiag.push(this._matrix[0][2]);
    return rDiag;
  }

  _getLeftDiagonal(){
    let lDiag = [];
    lDiag.push(this._matrix[0][0]);
    lDiag.push(this._matrix[1][1]);
    lDiag.push(this._matrix[2][2]);
    return lDiag;
  }

  getMark(row, col) {
    if(!this._isBoardPosition(row, col))
      throw new BoardInvalidRequest('Out of board range\n');

    return this._matrix[row][col];
  }

  setBoardPosition(position, mark) {
    if(!this._isValidMark(mark))
      throw new BoardInvalidRequest('Invalid Mark\n');

    const [row, col] = this._transformToMatrixCoord(position);

    if(!this._isBoardPosition(row, col))
      throw new BoardInvalidRequest('Out of board range\n');

    if(this._isOccupied(row, col))
      throw new BoardInvalidRequest("Position is occupied\n");

    this._matrix[row][col] = mark;
  }

  toString() {
    return this._matrix.map(row => row.map(e => e || ' ').join('|')).join('\n');
  }

  isFull() {
    return !this._getFlattenedMatrix().includes(null);
  }

  getUpperPositionRangeBoundary() {
    return this._getFlattenedMatrix().length;
  }

  getLowerPositionRangeBoundary() {
     return 1;
  }

  getWinLines() {

    let winLines = []

    winLines.push(this._getRightDiagonal());
    winLines.push(this._getLeftDiagonal());
    winLines.push(this._matrix[0]);
    winLines.push(this._matrix[1]);
    winLines.push(this._matrix[2]);
    winLines.push(this._getColumn(0));
    winLines.push(this._getColumn(1));
    winLines.push(this._getColumn(2));

    return winLines;
  }
}
