const SequenceGame = require('../server/game/SequenceGame')

describe('SequenceGame', () => {
  test('#startRound() should initialize expected board and players', () => {
    const game = new SequenceGame()

    game.addPlayer()
    game.startRound()

    expect(game._boardState.row[0].column[game._columns - 1]).toEqual(null)
    expect(game._boardState.row[game._rows - 1].column[0]).toEqual(null)
    expect(game._players).toHaveLength(1)
  })
})
