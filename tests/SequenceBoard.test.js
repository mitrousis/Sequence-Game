const SequenceBoard = require('../src/game/SequenceBoard')

describe('SequenceBoard', () => {
  test.only('#_populateBoardLayout()', () => {
    const board = new SequenceBoard()

    expect(
      board._populateBoardLayout(
        [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12]
        ]
      )
    )
      .toMatchObject(
        {
          row: [
            {
              column: [1, 2, 3, 4]
            },
            {
              column: [5, 6, 7, 8]
            },
            {
              column: [9, 10, 11, 12]
            }
          ]
        }
      )
  })

  test('#playBoardSpace() verify errors', () => {
    const board = new SequenceBoard()
    const playerId = 'playerId'
    board._boardState.row[0].column[1] = playerId
    board._boardState.row[0].column[2] = 'playerTwoId'

    expect(() => {
      board.playBoardSpace(0, 0, playerId)
    }).toThrowError('Cannot play on free space')

    expect(() => {
      board.playBoardSpace(0, 1, playerId)
    }).toThrowError('Cannot play own space')

    expect(() => {
      board.playBoardSpace(50, 11, playerId)
    }).toThrowError('Invalid space')

    expect(() => {
      board.playBoardSpace(0, 2, playerId)
    }).toThrowError('Space is already occupied')

    // Success
    expect(() => {
      board.playBoardSpace(1, 1, playerId)
    }).not.toThrow()
  })

  test('#_getBoardSpace() matching cases', () => {
    const board = new SequenceBoard()
    const playerId = 'playerId'
    board._boardState.row[0].column[1] = playerId

    expect(board._getBoardSpace(board._boardState, 10, 50)).toEqual(undefined)
    expect(board._getBoardSpace(board._boardState, 0, board._boardState.row[0].column.length - 1)).toEqual('free-space')
    expect(board._getBoardSpace(board._boardState, 1, 1)).toEqual('empty')
    expect(board._getBoardSpace(board._boardState, 0, 1)).toEqual(playerId)
  })

  describe('#_checkBoardSpace()', () => {
    let testBoard = {}

    beforeEach(() => {
      testBoard = createBoard(5, 5)
    })

    test('Should return 0 with unoccupied space', () => {
      const board = new SequenceBoard()
      testBoard.row[1].column[1] = 'playerid'

      expect(board._checkBoardSpace(testBoard, 1, 2, 'playerid')).toEqual(0)
    })

    test('Should return 1 with occupied space, no neighbors, no free spaces', () => {
      const board = new SequenceBoard()
      testBoard.row[2].column[2] = 'playerid'

      expect(board._checkBoardSpace(testBoard, 2, 2, 'playerid')).toEqual(1)
    })

    test('Should return 2 neighbors', () => {
      const board = new SequenceBoard()
      testBoard.row[1].column[1] = 'playerid'
      testBoard.row[1].column[2] = 'playerid'

      expect(board._checkBoardSpace(testBoard, 1, 1, 'playerid')).toEqual(2)
    })

    test('Should return 6 neighbors, even with outliers', () => {
      const board = new SequenceBoard()
      testBoard = createBoard(10, 10)

      testBoard.row[1].column[1] = 'playerid'
      testBoard.row[1].column[2] = 'playerid'
      testBoard.row[1].column[3] = 'playerid'
      testBoard.row[1].column[4] = 'playerid'
      testBoard.row[1].column[5] = 'playerid'
      testBoard.row[1].column[6] = 'playerid'
      // A few vertical outliers
      testBoard.row[2].column[1] = 'playerid'
      testBoard.row[3].column[1] = 'playerid'

      expect(board._checkBoardSpace(testBoard, 1, 1, 'playerid')).toEqual(6)
    })

    test('Should return sequence of 5, with free corners', () => {
      const board = new SequenceBoard()
      // Corners are at col 0 and 4
      testBoard.row[0].column[1] = 'playerid'
      testBoard.row[0].column[2] = 'playerid'
      testBoard.row[0].column[3] = 'playerid'

      expect(board._checkBoardSpace(testBoard, 0, 0, 'playerid')).toEqual(5)
    })

    test('Should return sequence of 5, with free corners and opponent', () => {
      const board = new SequenceBoard()

      // Corners are at col 0 and 4
      testBoard.row[0].column[1] = 'playerid'
      testBoard.row[0].column[2] = 'playerid'
      testBoard.row[0].column[3] = 'playerid'
      testBoard.row[1].column[4] = 'player2id'

      expect(board._checkBoardSpace(testBoard, 0, 4, 'playerid')).toEqual(5)
    })
  })

  describe('#_checkForWinningPlayer()', () => {
    test('Player1 should win', () => {
      const board = new SequenceBoard()

      const playerOne = 'playerOneId'
      const playerTwo = 'playerTwoId'

      const testBoard = createBoard(5, 5)

      testBoard.row[1].column[1] = playerOne
      testBoard.row[2].column[1] = playerOne
      testBoard.row[3].column[1] = playerOne
      testBoard.row[4].column[1] = playerOne

      testBoard.row[3].column[3] = playerTwo
      testBoard.row[4].column[3] = playerTwo

      expect(board._checkForWinningPlayer(testBoard, 4, [playerOne, playerTwo])).toEqual(playerOne)
    })
  })
})

function createBoard (rows, columns) {
  const b = {
    row: Array(rows).fill('empty')
  }

  for (const r in b.row) {
    b.row[r] = { column: Array(columns).fill('empty') }
  }

  return b
}
