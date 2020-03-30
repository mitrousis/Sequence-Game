const Deck = require('./Deck')
const SequenceCard = require('./SequenceCard')
const GameData = require('./SequenceGameData')

class SequenceDeck extends Deck {
  constructor () {
    const cardValues = []

    // Create as many sets as needed
    for (let s = 0; s < GameData.cardSets; s++) {
      GameData.cardData.forEach((cardData) => {
        // Deep clone the card data
        cardData = JSON.parse(JSON.stringify(cardData))
        cardValues.push(cardData)
      })
    }

    // // Create cards from characters
    // GameData.cardData.forEach((cardData) => {
    //   cards.push(this._initializeCard(cardData))
    // })

    // // Quick and dirty
    // cards = cards.concat(JSON.parse(JSON.stringify(cards)))

    super(cardValues)
  }

  _initializeCard (cardData) {
    return new SequenceCard(cardData)
  }
}

module.exports = SequenceDeck
