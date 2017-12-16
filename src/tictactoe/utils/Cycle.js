module.exports = class Cycle {
  constructor(data){
    this._data = data;
    this._index = 0;
  }

  getDefaultPlayer() {
    return this._data[0];
  }

  next(){
    return this._data[this._index++ % this._data.length];
  }
}
