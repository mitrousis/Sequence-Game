const BaseGameElement = require('./BaseGameElement')
const Card = require('./Card')

/**
 * Generic card deck controller
 */
class Deck extends BaseGameElement {
  /**
   * Can be initialized with card values
   * @param {Array} cardValues
   */
  constructor (cardValues) {
    super()

    this._masterCardDeck = []
    /** @type {Array} */
    this._currentDeck = []
    /** @type {Array} */
    this._discards = []

    if (cardValues) {
      cardValues.forEach((cardData) => {
        this.addCard(this._initializeCard(cardData))
      })
    }

    this.reset()
  }

  addCard (card) {
    this._masterCardDeck.push(card)
  }

  /**
   *
   * @param {String} cardId
   * @returns {Card}
   */
  getCardById (cardId) {
    return this._masterCardDeck.filter((card) => card.id === cardId)
  }

  /**
   * Just resets the deck with cards, doesn't shuffle
   */
  reset () {
    this._currentDeck = []
    this._discards = []
    this._currentDeck = this._masterCardDeck.slice()
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
   * @param {Number} count
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

  /**
   *
   * @param {Card} card
   */
  discard (card) {
    this._discards.push(card)
  }

  collectDiscards () {
    this._currentDeck = this._currentDeck.concat(this._discards)
    this._discards = []
  }

  /**
   * Populates card data, overwrite as needed to create game specific cards
   * @param {Object} cardData
   * @returns {Card}
   */
  _initializeCard (cardData) {
    return new Card(cardData)
  }
}

module.exports = Deck
