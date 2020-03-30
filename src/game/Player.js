const BaseGameElement = require('./BaseGameElement')

/**
 * @typedef {import('./Card')} Card
 */

class Player extends BaseGameElement {
  constructor (playerData) {
    super()

    /** @type {Array.<Card>} */
    this._currentHand = []
    this._playerData = playerData
  }

  /**
   *
   * @param {Array} cards
   */
  addCardsToHand (cards) {
    this._currentHand = this._currentHand.concat(cards)
  }

  removeCardFromHand (card) {
    this._currentHand.splice(this._currentHand.indexOf(card), 1)
  }

  /**
   * @returns {Array} cards in hand
   */
  get currentHand () {
    return this._currentHand
  }
}

module.exports = Player
