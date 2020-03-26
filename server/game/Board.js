const { v4: uuidv4 } = require('uuid')

class Board {
  constructor () {
    this._id = uuidv4()
  }

  /**
   * id isn't used anywhere yet
   * @returns {String} unique board id
   */
  get id () {
    return this._id
  }
}

module.exports = Board
