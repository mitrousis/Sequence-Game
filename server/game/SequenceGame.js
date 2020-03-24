const Game = require('./Game')
const SequenceDeck = require('./SequenceDeck')

/**
 * @typedef {import('./Player')} Player
 */

class SequenceGame extends Game {
  constructor () {
    super()

    this.gameType = 'sequence'

    // Game parameters
    this._rows = 7
    this._columns = 6
    this._minPlayerCount = 2
    this._maxPlayerCount = 4
    this._winningSequentialMatches = 4
    this._startingCardCount = 3

    // Internal
    this._boardState = {}
    this._deck = new SequenceDeck()
  }

  startRound () {
    super.startRound()

    this._boardState = this._getEmptyBoardState(this._rows, this._columns)

    this._deck.reset()
    this._deck.shuffle()

    // Deal to all players
    this._players.forEach((player) => {
      player.addCardsToHand(this._deck.deal(this._startingCardCount))
    })

    // At this point the game has started
  }

  /**
   *
   * @param {number} row
   * @param {number} column
   * @param {Player} player
   */

  playBoardSpace (row, column, player) {
    if (this.currentPlayer !== player) {
      throw Error('Invalid player for turn')
    }

    let isValidMove = true
    // Can't place on corners
    if (this._isFreeSpace(this._boardState, row, column)) isValidMove = false

    // Can't place on existing square
    if (this._boardState.row[row].column[column] !== null) {
      isValidMove = false
    }

    if (!isValidMove) throw Error('Invalid move')

    // Put the playerId in that spot. This makes it easier
    // to compare and serialize the data for sending
    this._boardState.row[row].column[column] = player.id
  }

  /**
   * Checks board for any players that have won
   * @param {object} boardState
   * @returns {string} winning playerId
   */
  _checkForWinningPlayer (boardState, winningSequentialMatches = this._winningSequentialMatches) {
    const lastRow = boardState.row.length - 1
    const lastColumn = boardState.row[lastRow].column.length - 1

    for (let row = 0; row <= lastRow; row++) {
      for (let column = 0; column <= lastColumn; column++) {
        // Check all players, first one that it finds with matching sequence wins
        for (const player of this._players) {
          const playerId = player.id
          const sequentialMatches = this._checkBoardSpace(boardState, row, column, playerId)
          if (sequentialMatches === winningSequentialMatches) {
            return playerId
          }
        }
      }
    }

    return null
  }

  /**
   * Checks a given board space and returns the number of
   * sequential connected spaces in all 6 directions.
   * ex: return value of 0 = no matching space
   * ex: return value of 1 = 1 matching space
   * ex: return value of 4 = 4 sequential matching spaces, including the one being tested
   * Note this doesn't return the full sequence if the check space isn't at the beginning or end of sequence
   * @param {object} boardState
   * @param {number} homeRow
   * @param {number} homeColumn
   * @param {string} playerId
   * @param {string} direction
   * @param {number} iteration
   * @returns {number} number of sequential matching spaces
   */
  _checkBoardSpace (boardState, homeRow, homeColumn, playerId, direction = null, iteration = 0) {
    let isValidMatch = false
    // Ensure this is a valid spot within board bounds
    if (boardState.row[homeRow] !== undefined && boardState.row[homeRow].column[homeColumn] !== undefined) {
      if (this._isFreeSpace(boardState, homeRow, homeColumn) || boardState.row[homeRow].column[homeColumn] === playerId) {
        isValidMatch = true
      }
    }

    if (isValidMatch === false) return iteration

    const rowStartDir = direction ? parseInt(direction.split(',')[0]) : -1
    const columnStartDir = direction ? parseInt(direction.split(',')[1]) : -1

    let maxSequentialIterations = 1
    // If valid space, check for neighbors
    for (let rowOffset = rowStartDir; rowOffset <= 1; rowOffset++) {
      for (let columnOffset = columnStartDir; columnOffset <= 1; columnOffset++) {
        // Skip checking this same space
        if (!(rowOffset === 0 && columnOffset === 0)) {
          // Actual row, column to check (includes the offset)
          const checkRow = homeRow + rowOffset
          const checkColumn = homeColumn + columnOffset

          const checkDirection = direction || `${rowOffset},${columnOffset}`
          const sequentialIterations = this._checkBoardSpace(boardState, checkRow, checkColumn, playerId, checkDirection, iteration + 1)
          if (iteration !== 0) return sequentialIterations

          maxSequentialIterations = Math.max(maxSequentialIterations, sequentialIterations)
        }
      }
    }

    // Found nothing
    return maxSequentialIterations
  }

  _isFreeSpace (boardState, row, column) {
    const lastRow = boardState.row.length - 1
    const lastColumn = boardState.row[lastRow].column.length - 1

    return (column === 0 || column === lastColumn) &&
      (row === 0 || row === lastRow)
  }

  _getEmptyBoardState (rows, columns) {
    // Board can be referenced ex: _boardState.row[0].column[1]
    const emptyBoard = {
      row: Array(rows).fill(null)
    }

    for (const r in emptyBoard.row) {
      emptyBoard.row[r] = { column: Array(columns).fill(null) }
    }

    return emptyBoard
  }

  // addPlayer () {
  //   return super.addPlayer()
  // }
}

module.exports = SequenceGame
