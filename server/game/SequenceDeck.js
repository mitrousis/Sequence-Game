const Deck = require('./Deck')

class SequenceDeck extends Deck {
  constructor () {
    super(sequenceCards)
  }
}

let sequenceCards = [
  {
    name: 'Larry the Lion',
    type: 'default'
  },
  {
    name: 'Unicorn',
    type: 'something-special'
  }
]

// Quick and dirty deep doubling
sequenceCards = sequenceCards.concat(JSON.parse(JSON.stringify(sequenceCards)))

module.exports = SequenceDeck
