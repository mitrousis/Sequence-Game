const Deck = require('../src/game/Deck')

describe('Deck', () => {
  test('Should be initialized with card values', () => {
    const deck = new Deck([
      { card: 'a' },
      { card: 'b' }
    ])

    expect(deck._currentDeck).toHaveLength(2)
  })

  test('Shuffle should randomize deck', () => {
    const deck = new Deck([
      { card: 'a' },
      { card: 'b' },
      { card: 'c' },
      { card: 'd' },
      { card: 'e' }
    ])

    // Try it 3 times
    deck.shuffle()
    const deckA = JSON.stringify(deck._currentDeck)
    deck.shuffle()
    const deckB = JSON.stringify(deck._currentDeck)
    deck.shuffle()
    const deckC = JSON.stringify(deck._currentDeck)

    expect(deck._currentDeck).toHaveLength(5)
    expect(deckA === deckB).toEqual(false)
    expect(deckB === deckC).toEqual(false)
    expect(deckA === deckC).toEqual(false)
  })

  test('Deal should deal and reshuffle the discards', () => {
    const deck = new Deck([
      { card: 'a' },
      { card: 'b' },
      { card: 'c' },
      { card: 'd' },
      { card: 'e' }
    ])

    // Make a copy to verify
    const expectedDeck = deck._currentDeck.slice()

    let dealtCards = deck.deal(3)
    // Put them back
    dealtCards.forEach((cardId) => {
      deck.discard(cardId)
    })

    // Get all cards from the deck
    dealtCards = deck.deal(5, true)
    expect(deck._currentDeck).toHaveLength(0)
    expect(dealtCards).toEqual(expect.arrayContaining(expectedDeck))
  })
})
