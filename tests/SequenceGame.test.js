const SequenceGame = require('../server/SequenceGame')

describe('SequenceGame', () => {
  test('#NewRound() should initialize expected board and players', () => {
    const game = new SequenceGame()

    game.addPlayer()
    game.newRound()

    expect(game._boardState.row[0].column[game._columns - 1]).toEqual(null)
    expect(game._boardState.row[game._rows - 1].column[0]).toEqual(null)
    expect(game._playerIds).toHaveLength(1)
  })

  test('#updateBoard() verify errors', () => {
    const game = new SequenceGame()

    game.addPlayer()
    game.newRound()

    expect(() => {
      game.updateBoard(0, 0, game.currentPlayer)
    }).toThrowError('Invalid move')

    expect(() => {
      game.updateBoard(0, game._columns - 1, game.currentPlayer)
    }).toThrowError('Invalid move')

    expect(() => {
      game.updateBoard(game._rows - 1, 0, game.currentPlayer)
    }).toThrowError('Invalid move')

    expect(() => {
      game.updateBoard(game._rows - 1, game._columns - 1, game.currentPlayer)
    }).toThrowError('Invalid move')

    expect(() => {
      game.updateBoard(1, 1, 'invalidplayerid')
    }).toThrowError('Invalid player for turn')
  })

  test.only('#_checkWinningBoardState()', () => {
    const game = new SequenceGame()

    const state = game._getEmptyBoardState(10, 10)
    state.row[1].column[1] = 'playerid'

    expect(game._checkBoardNeighbors(state, 0, 0, 'playerid')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          row: 1,
          column: 1
        })
      ]))
  })
})
