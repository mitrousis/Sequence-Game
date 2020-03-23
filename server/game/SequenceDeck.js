const Deck = require('./Deck')

class SequenceDeck extends Deck {
  constructor () {
    super(sequenceCards)
  }
}

// TODO: make these cards an object
const sequenceCards = [
  {
    name: 'Larry the Lion',
    type: 'default'
  },
  {
    name: 'Unicorn',
    type: 'something-special'
  }
]

sequenceCards = sequenceCards.concat(sequenceCards)

module.exports = SequenceDeck
