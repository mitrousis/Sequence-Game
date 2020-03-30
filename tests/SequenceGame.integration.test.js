const GameManager = require('../src/game/GameManager')
const SequenceDeck = require('../src/game/SequenceDeck')

/** @typedef {import ('../src/game/SequenceGame')} SequenceGame */
/** @typedef {import ('../src/game/Player')} Player */

// These tests are assumed to run in order
describe('Sequence Game end-to-end', () => {
  const gm = new GameManager()
  /** @type {Player} */
  let playerOne, playerTwo

  /** @type {SequenceGame} */
  let game

  test('Create a new game instance', () => {
    game = gm.startNewGame('sequence')
    game.newRound()

    expect(game.gameType).toEqual('sequence')
    expect(game.openForPlayers).toEqual(true)
    expect(game._deck._currentDeck.length).toEqual(42)
  })

  test('Add two players', () => {
    playerOne = game.addPlayer({ name: 'player one' })
    playerTwo = game.addPlayer({ name: 'player two' })

    expect(game._players.length).toEqual(2)
  })

  test('Start next round', () => {
    // Turn off shuffle
    game._deck.shuffle = sortDeck

    // game._deck.shuffle()
    // const cardList = []
    // game._deck._currentDeck.forEach((card) => {
    //   cardList.push(card.characterId)
    // })

    // console.log(cardList)

    game.startRound()

    expect(game.openForPlayers).toEqual(false)
    expect(game._playerTurnIndex).toEqual(0)
    expect(playerOne.currentHand.length).toEqual(3)
  })

  test('Player one first move', () => {
    // P1, Plays Gloria, @ 1, 1
    game.playCard(playerOne, playerOne.currentHand[1], 1, 1)
    // P2, Plays Trevor, @ 0, 1
    game.playCard(playerTwo, playerTwo.currentHand[1], 0, 1)

    // P1 Plays Camille, @ 2, 2
    game.playCard(playerOne, playerOne.currentHand[1], 2, 2)
    // P2, Plays Eddy, @ 2, 5
    game.playCard(playerTwo, playerTwo.currentHand[1], 2, 5)

    // P1 Plays Zelda, @ 1, 2
    game.playCard(playerOne, playerOne.currentHand[1], 1, 2)
    // P2, Plays Dorothy, @ 1, 2, removes Zelda
    game.playCard(playerTwo, playerTwo.currentHand[0], 1, 2)

    // Plays winning with Ulysses
    game.playCard(playerOne, playerOne.currentHand[0], 3, 3)

    expect(game._roundWinner).toEqual(playerOne)

    // const cardOrder = [
    //   'ulysses',
    //   -- 1 'gloria',
    //   -- 2 'camille',
    //   -- 3 'zelda', (removed)
    //   (wilde hippo)

    //   -- 'monte',
    //   'francie',
    //   -- 'gerry',
    //   -- 'willie',

    //   // p2
    //   'dorothy',
    //   'trevor',
    //   'eddy',
    //   'percy',
    //   'lucas',
    //   'sherman',
    //   'henry',
    //   'polly'
    // ]

    // console.log(playerOne.currentHand)
    // console.log(playerTwo.currentHand)
    // game.playBoardSpace()
  })
})

// Replaces shuffle for testing for predictable ordering
function sortDeck () {
  this._currentDeck.sort(function (a, b) {
    // Moves the special cards to the back
    if (a.type === 'any-space' || a.type === 'remove-chip') {
      return 1
    }
    return 0
  })

  // Gives player 1 any-space
  const anySpace = this._currentDeck.findIndex((card) => {
    return card.type === 'any-space'
  })

  this._currentDeck.splice(0, 0, this._currentDeck.splice(anySpace, 1)[0])

  // Gives player 2 remove-chip
  const removeChip = this._currentDeck.findIndex((card) => {
    return card.type === 'remove-chip'
  })

  this._currentDeck.splice(3, 0, this._currentDeck.splice(removeChip, 1)[0])
}
