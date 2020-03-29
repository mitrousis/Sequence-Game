const SequenceGame = require('../src/game/SequenceGame')
const SequencePlayer = require('../src/game/SequencePlayer')

describe('SequenceGame', () => {
  test('#startRound() should initialize expected board and players', () => {
    const game = new SequenceGame()

    const player = game.addPlayer()

    expect(player instanceof SequencePlayer).toEqual(true)
    expect(game._players).toHaveLength(1)
  })
})
