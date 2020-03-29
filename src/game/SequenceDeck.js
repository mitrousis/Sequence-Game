const Deck = require('./Deck')
const GameData = require('./SequenceGameData')

class SequenceDeck extends Deck {
  constructor () {
    let cards = []

    // Create cards from characters
    Object.entries(GameData.characters).forEach(([id, value]) => {
      cards.push({ id, ...value })
    })

    // Quick and dirty deep doubling
    cards = cards.concat(JSON.parse(JSON.stringify(cards)))

    super(cards)
  }
}

module.exports = SequenceDeck
