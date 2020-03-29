const Board = require('./Board')
const GameData = require('./SequenceGameData')

/**
 * Class for tracking the state of the game board
 * and logic for checking winning state
 */
class SequenceBoard extends Board {
  constructor () {
    super()

    this._rows = 7
    this._columns = 6
    this._boardState = {}
    this._boardLayout = this._populateBoardLayout(GameData.boardLayout)

    this.reset()
  }

  reset () {
    const emptyBoard = {
      row: Array(this._rows).fill('empty')
    }

    for (const r in emptyBoard.row) {
      emptyBoard.row[r] = { column: Array(this._columns).fill('empty') }
    }

    this._boardState = emptyBoard
  }

  playBoardSpace (row, column, playerId) {
    const spaceValue = this._getBoardSpace(this._boardState, row, column)
    switch (spaceValue) {
      case 'free-space':
        throw Error('Cannot play on free space')

      case playerId:
        throw Error('Cannot play own space')

      case undefined:
        throw Error('Invalid space')

      case 'empty':
        this._boardState.row[row].column[column] = playerId
        break

      // Space is otherwise occupied
      default:
        throw Error('Space is already occupied')
    }
  }

  removeBoardSpace (row, column, playerId) {
    const spaceValue = this._getBoardSpace(this._boardState, row, column)
    switch (spaceValue) {
      case 'free-space':
        throw Error('Cannot remove player from free space')

      case playerId:
        throw Error('Cannot remove own player space')

      case undefined:
        throw Error('Invalid space')

      case 'empty':
        throw Error('Space is empty')

      // Otherwise, remove the player id in the space
      default:
        this._boardState.row[row].column[column] = null
        break
    }
  }

  /**
   * Checks board for any players that have won
   * @param {Object} boardState
   * @param {Number} winningSequentialMatches how many to win
   * @param {Array.<String>} playerIds player ids to check for
   * @returns {String|null} winning player id
   */
  _checkForWinningPlayer (boardState, winningSequentialMatches, playerIds = []) {
    const lastRow = boardState.row.length - 1
    const lastColumn = boardState.row[lastRow].column.length - 1

    for (let row = 0; row <= lastRow; row++) {
      for (let column = 0; column <= lastColumn; column++) {
        // Check all players, first one that it finds with matching sequence wins
        for (const playerId of playerIds) {
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
   * @param {Object} boardState
   * @param {Number} homeRow
   * @param {Number} homeColumn
   * @param {String} playerId
   * @param {String} direction
   * @param {Number} iteration
   * @returns {Number} number of sequential matching spaces
   */
  _checkBoardSpace (boardState, homeRow, homeColumn, playerId, direction = null, iteration = 0) {
    const spaceValue = this._getBoardSpace(boardState, homeRow, homeColumn)
    if (!(spaceValue === 'free-space' || spaceValue === playerId)) {
      return iteration
    }

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

  /**
   *
   * @param {objet} boardState
   * @param {Number} row
   * @param {Number} column
   * @returns {String} undefined | 'free-space' | 'empty' | playerId |
   */
  _getBoardSpace (boardState, row, column) {
    const lastRow = boardState.row.length - 1
    const lastColumn = boardState.row[lastRow].column.length - 1

    // Validate the row and column
    if (boardState.row[row] === undefined || boardState.row[row].column[column] === undefined) {
      return undefined
    } else if ((column === 0 || column === lastColumn) && (row === 0 || row === lastRow)) {
      return 'free-space'
    } else {
      return boardState.row[row].column[column]
    }
  }

  /**
   * Taken from game data
   * @param {Array} layoutModel
   * @returns {Object} with row[rowNum].column[columnNum] format
   */
  _populateBoardLayout (layoutModel) {
    const boardLayout = {}

    boardLayout.row = []
    for (const columnValues of layoutModel) {
      boardLayout.row.push({
        column: columnValues
      })
    }

    return boardLayout
  }
}

module.exports = SequenceBoard
