const Card = require('./Card')

class SequenceCard extends Card {
  static get TYPE_REMOVE_CHIP () {
    return 'remove-chip'
  }

  static get TYPE_ANY_SPACE () {
    return 'any-space'
  }

  static get TYPE_STANDARD () {
    return 'standard'
  }

  get characterId () {
    return this._cardData.characterId
  }

  get name () {
    return this._cardData.name
  }

  get animal () {
    return this._cardData.animal
  }

  get type () {
    return this._cardData.type
  }
}

module.exports = SequenceCard
