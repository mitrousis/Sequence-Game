const { v4: uuidv4 } = require('uuid')

/**
 * Generic card deck controller
 */
class Deck {
  /**
   * Can be initialized with card values
   * @param {array} cardValues
   */
  constructor (cardValues) {
    this._masterCardDeck = []
    /** @type {Array} */
    this._currentDeck = []
    /** @type {Array} */
    this._discards = []

    if (cardValues) {
      cardValues.forEach((cardValue) => {
        this.addCard(cardValue)
      })
    }

    this.reset()
  }

  addCard (cardValue) {
    // Create unique id for the card
    this._masterCardDeck.push({
      id: uuidv4(),
      ...cardValue
    })
  }

  getCardById (cardId) {
    return this._masterCardDeck.filter((card) => card.id === cardId)
  }

  /**
   * Just resets the deck with cards, doesn't shuffle
   */
  reset () {
    this._currentDeck = []
    this._discards = []

    // Might need to break the reference here at some point
    this._currentDeck = this._masterCardDeck.slice()
    // for (const cardId in this._cardValues) {
    //   this._currentDeck.push(cardId)
    // }
  }

  shuffle () {
    var currentIndex = this._currentDeck.length
    var temporaryValue
    var randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = this._currentDeck[currentIndex]
      this._currentDeck[currentIndex] = this._currentDeck[randomIndex]
      this._currentDeck[randomIndex] = temporaryValue
    }
  }

  /**
   * Deals a number of cards. Will collect the discards and reshuffle
   * @param {number} count
   * @param {boolean} reshuffleIfNeeded
   */
  deal (count, reshuffleIfNeeded = true) {
    if (count > this._currentDeck.length && reshuffleIfNeeded) {
      this.collectDiscards()
      this.shuffle()
    }

    count = Math.min(count, this._currentDeck.length)

    return this._currentDeck.splice(0, count)
  }

  discard (cardId) {
    this._discards.push(cardId)
  }

  collectDiscards () {
    this._currentDeck = this._currentDeck.concat(this._discards)
    this._discards = []
  }
}

module.exports = Deck
