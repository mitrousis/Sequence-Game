const BaseGameElement = require('./BaseGameElement')

class Card extends BaseGameElement {
  constructor (cardData) {
    super()

    this._cardData = cardData
  }
}

module.exports = Card
