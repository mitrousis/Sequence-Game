const { v4: uuidv4 } = require('uuid')

class Player {
  constructor () {
    this._id = uuidv4()
    this._currentHand = []
  }

  /**
   * @returns {string} unique player id
   */
  get id () {
    return this._id
  }
}

module.exports = Player
