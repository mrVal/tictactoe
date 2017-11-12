module.exports = class BoardInvalidRequest extends Error {
  constructor(msg, ...args) {
    super(msg, ...args);

    Object.defineProperty(this, 'name', {
      get: () => this.constructor.name
    });
    Object.defineProperty(this, 'message', {
      get: () => msg || 'Position is not correct'
    });

    Error.captureStackTrace(this, this.constructor);
  }
}
