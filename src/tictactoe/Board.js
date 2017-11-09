const BoardInvalidRequest = require('.').BoardInvalidRequest;

module.exports = class Board{

  constructor () {
    this._matrix = [[null, null, null],
                    [null, null, null],
                    [null, null, null]];

    this._latestMove = null;
  }

  _transformToMatrixCoord(position){
    let i = 3 - Math.floor((position - 1) / 3) - 1;
    let j = (position - 1) % 3;

    return [i,j];
  }

  _checkIfValidMark(mark) {
    if((mark ==='x') || (mark === 'o')) {

    } else {
      throw new BoardInvalidRequest('Invalid mark');
    }
  }

  _checkIfBoardPosition(row, col) {
    if(isFinite(row) && isFinite(col)) {
      if((row < 0 || row >= this.matrix.length) ||
        (col < 0 || col >= this.matrix[row].length)) {
        throw new BoardInvalidRequest('Out of board range\n');
      }
    }
  }

  _checkIfOccupied() {
    if(this._matrix[row][col]) {
      throw new BoardInvalidRequest('Cell occupied\n');
    }
  }

  _getFlattenedMatrix() {
    let flattened = [];
    this._matrix.map(function(e) {
      flattened = flattened.concat(e);
    });
    return flattened;
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

  toString() {
    return this._matrix.map(row => row.map(e => e || ' ').join('|')).join('\n');
  }

  getLatestMove() {
    return this._latestMove;
  }

  occupyPosition(position, mark) {
    try{
      this._checkIfValidMark(mark);
      [row, col] = this._transformToMatrixCoord(position);
      this._checkIfBoardPosition(row, col);
      this._checkIfOccupied(row, col);
      this._latestMove = [row, col]
      this._matrix[row][col] = mark;
    } catch (e) {
      console.log("Board occupyPosition exception. " + e.message);
    }

  }

  isFull() {
    return !(this._getFlattened().includes(null));
  }

  //for AI or any player to find move range boundaries

  getUpperPositionRangeBoundary() {
    return this._getFlattenedMatrix().length;
  }

  getLowerPositionRangeBoundary() {
     return 1;
  }

  ///////

// getWinLines returns and array of lines. Should at least one of them be
// filled with the same mark, it results it victory
// use getWinLines() in Game class like this:
// isWin(){
//   win = board.getWinLines().some(function(winLine) {
//       return line.every(function(cell) {
//         return cell === currentPlayer;
//       });
//     });
//
//     return win;
// }

  getWinLines() {

    //there is a little glitch. There are a couple of "undefineds"
    //lurking here.

    let winLines = []

    winLines.push(this._rightDiagonal);
    winLines.push(this._leftDiagonal);
    winLines.push(this._matrix[0]);
    winLines.push(this._matrix[1]);
    winLines.push(this._matrix[2]);
    winLines.push(this._getColumn(0));
    winLines.push(this._getColumn(1));
    winLines.push(this._getColumn(2));

    return winLines;
  }
}
