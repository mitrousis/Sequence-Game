const { v4: uuidv4 } = require('uuid')

class Player {
  constructor () {
    this._id = uuidv4()
    this._currentHand = []
  }

  /**
   *
   * @param {Array} cards
   */
  addCardsToHand (cards) {
    this._currentHand = this._currentHand.concat(cards)
  }

  /**
   * @returns {Array} cards in hand
   */
  get currentHand () {
    return this._currentHand
  }

  /**
   * @returns {String} unique player id
   */
  get id () {
    return this._id
  }
}

module.exports = Player
