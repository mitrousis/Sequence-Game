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

  test('#_isFreeSpace() should match corner spaces', () => {
    const game = new SequenceGame()
    const state = game._getEmptyBoardState(10, 10)

    expect(game._isFreeSpace(state, 0, 0)).toEqual(true)
    expect(game._isFreeSpace(state, 0, 9)).toEqual(true)
    expect(game._isFreeSpace(state, 9, 0)).toEqual(true)
    expect(game._isFreeSpace(state, 9, 9)).toEqual(true)
    expect(game._isFreeSpace(state, 1, 9)).toEqual(false)
  })

  describe('#_checkBoardSpace()', () => {
    test('Should return 0 with unoccupied space', () => {
      const game = new SequenceGame()

      const state = game._getEmptyBoardState(10, 10)
      state.row[1].column[1] = 'playerid'

      expect(game._checkBoardSpace(state, 1, 2, 'playerid')).toEqual(0)
    })

    test('Should return 1 with occupied space, no neighbors, no free spaces', () => {
      const game = new SequenceGame()

      const state = game._getEmptyBoardState(10, 10)
      state.row[2].column[2] = 'playerid'

      expect(game._checkBoardSpace(state, 2, 2, 'playerid')).toEqual(1)
    })

    test('Should return 2 neighbors', () => {
      const game = new SequenceGame()

      const state = game._getEmptyBoardState(10, 10)
      state.row[1].column[1] = 'playerid'
      state.row[1].column[2] = 'playerid'

      expect(game._checkBoardSpace(state, 1, 1, 'playerid')).toEqual(2)
    })

    test('Should return 6 neighbors, even with outliers', () => {
      const game = new SequenceGame()

      const state = game._getEmptyBoardState(10, 10)
      state.row[1].column[1] = 'playerid'
      state.row[1].column[2] = 'playerid'
      state.row[1].column[3] = 'playerid'
      state.row[1].column[4] = 'playerid'
      state.row[1].column[5] = 'playerid'
      state.row[1].column[6] = 'playerid'
      // A few vertical outliers
      state.row[2].column[1] = 'playerid'
      state.row[3].column[1] = 'playerid'

      expect(game._checkBoardSpace(state, 1, 1, 'playerid')).toEqual(6)
    })

    test('Should return sequence of 5, with free corners', () => {
      const game = new SequenceGame()

      const state = game._getEmptyBoardState(5, 5)
      // Corners are at col 0 and 4
      state.row[0].column[1] = 'playerid'
      state.row[0].column[2] = 'playerid'
      state.row[0].column[3] = 'playerid'

      expect(game._checkBoardSpace(state, 0, 0, 'playerid')).toEqual(5)
    })

    test('Should return sequence of 5, with free corners and opponent', () => {
      const game = new SequenceGame()

      const state = game._getEmptyBoardState(5, 5)
      // Corners are at col 0 and 4
      state.row[0].column[1] = 'playerid'
      state.row[0].column[2] = 'playerid'
      state.row[0].column[3] = 'playerid'
      state.row[1].column[4] = 'player2id'

      expect(game._checkBoardSpace(state, 0, 4, 'playerid')).toEqual(5)
    })
  })

  describe('#_checkForWinningPlayer()', () => {
    test('Player1 should win', () => {
      const game = new SequenceGame()

      const playerOneId = game.addPlayer()
      const playerTwoId = game.addPlayer()
      const state = game._getEmptyBoardState(10, 10)

      state.row[1].column[1] = playerOneId
      state.row[2].column[1] = playerOneId
      state.row[3].column[1] = playerOneId
      state.row[4].column[1] = playerOneId

      state.row[4].column[3] = playerTwoId
      state.row[5].column[3] = playerTwoId

      expect(game._checkForWinningPlayer(state, 4)).toEqual(playerOneId)
    })
  })
})
