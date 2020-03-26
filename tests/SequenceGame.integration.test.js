const GameManager = require('../server/game/GameManager')
const SequenceDeck = require('../server/game/SequenceDeck')

/** @typedef {import ('../server/game/SequenceGame')} SequenceGame */
/** @typedef {import ('../server/game/Player')} Player */

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
    expect(game.waitingForPlayers).toEqual(true)
  })

  test('Add two players', () => {
    playerOne = game.addPlayer()
    playerTwo = game.addPlayer()

    expect(game._players.length).toEqual(2)
  })

  test('Start next round', () => {
    game.startRound()

    expect(game.waitingForPlayers).toEqual(false)
    expect(game._playerTurnIndex).toEqual(0)
    expect(playerOne.currentHand.length).toEqual(3)

    // Check first card
    // Quick check to ensure a proper card was populated
    expect(playerOne.currentHand[0]).toHaveProperty('id')
  })

  test('Start next round', () => {
    game.playBoardSpace()
  })
})
