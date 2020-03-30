const Board = require('./Board')
const SequenceCard = require('./SequenceCard')

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

  static get VALUE_FREE_SPACE () {
    return 'free-space'
  }

  static get VALUE_EMPTY () {
    return 'empty'
  }

  reset () {
    const emptyBoard = {
      row: Array(this._rows).fill(SequenceBoard.VALUE_EMPTY)
    }

    for (const r in emptyBoard.row) {
      emptyBoard.row[r] = { column: Array(this._columns).fill(SequenceBoard.VALUE_EMPTY) }
    }

    this._boardState = emptyBoard
  }

  /**
   * Main card playing logic
   * @param {SequencePlayer} player
   * @param {SequenceCard} card
   * @param {Number} row
   * @param {Number} column
   */
  playCard (player, card, row, column) {
    const spaceValue = this._getBoardSpace(this._boardState, row, column)
    const spaceCharacterId = this._getBoardLayoutSpace(this._boardLayout, row, column)

    // Validation
    switch (spaceValue) {
      case player:
        throw Error('Cannot play own space')

      case SequenceBoard.VALUE_FREE_SPACE:
        throw Error('Cannot play on free space')

      case undefined:
        throw Error('Invalid space')
    }

    // Card type
    switch (card.type) {
      case SequenceCard.TYPE_REMOVE_CHIP:
        if (spaceValue === SequenceBoard.VALUE_EMPTY) {
          throw Error('Cannot remove empty space')
        }

        // Empty out the space
        this._setBoardSpace(this._boardState, row, column, SequenceBoard.VALUE_EMPTY)
        break

      case SequenceCard.TYPE_ANY_SPACE:
        this._setBoardSpace(this._boardState, row, column, player)
        break

      // Set the player to the space, validate
      case SequenceCard.TYPE_STANDARD:
        if (card.characterId !== spaceCharacterId) {
          throw Error(`Cannot play ${card.characterId} on space with ${spaceCharacterId}`)
        }

        this._setBoardSpace(this._boardState, row, column, player)
        break
    }
  }

  /**
   * Checks board for any players that have won
   * @param {SequencePlayer} player
   * @param {Number} winningSequentialMatches how many to win
   * @param {Array.<SequencePlayer>} allPlayers players to check for
   * @returns {Boolean}
   */
  isWinningPlayer (player, winningSequentialMatches, allPlayers) {
    return player === this._checkForWinningPlayer(this._boardState, winningSequentialMatches, allPlayers)
  }

  /**
   * Private method for searching for winning player
   * @param {Object} boardState
   * @param {Number} winningSequentialMatches how many to win
   * @param {Array.<SequencePlayer>} players players to check for
   * @returns {SequencePlayer|null} winning player
   */
  _checkForWinningPlayer (boardState, winningSequentialMatches, players) {
    const lastRow = boardState.row.length - 1
    const lastColumn = boardState.row[lastRow].column.length - 1

    for (let row = 0; row <= lastRow; row++) {
      for (let column = 0; column <= lastColumn; column++) {
        // Check all players, first one that it finds with matching sequence wins
        for (const player of players) {
          const sequentialMatches = this._checkBoardSpace(boardState, row, column, player)
          if (sequentialMatches === winningSequentialMatches) {
            return player
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
   * @param {SequencePlayer} player
   * @param {String} direction
   * @param {Number} iteration
   * @returns {Number} number of sequential matching spaces
   */
  _checkBoardSpace (boardState, homeRow, homeColumn, player, direction = null, iteration = 0) {
    const spaceValue = this._getBoardSpace(boardState, homeRow, homeColumn)
    if (!(spaceValue === SequenceBoard.VALUE_FREE_SPACE || spaceValue === player)) {
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
          const sequentialIterations = this._checkBoardSpace(boardState, checkRow, checkColumn, player, checkDirection, iteration + 1)
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
   * @returns {SequencePlayer|String} undefined | 'free-space' | 'empty' | SequencePlayer in location
   */
  _getBoardSpace (boardState, row, column) {
    const lastRow = boardState.row.length - 1
    const lastColumn = boardState.row[lastRow].column.length - 1

    // Validate the row and column
    if (boardState.row[row] === undefined || boardState.row[row].column[column] === undefined) {
      return undefined
    } else if ((column === 0 || column === lastColumn) && (row === 0 || row === lastRow)) {
      return SequenceBoard.VALUE_FREE_SPACE
    } else {
      return boardState.row[row].column[column]
    }
  }

  /**
   *
   * @param {Object} boardState
   * @param {Number} row
   * @param {Number} column
   * @param {*} value
   */
  _setBoardSpace (boardState, row, column, value) {
    boardState.row[row].column[column] = value
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

  /**
   * Returns the value at a board space
   * @param {Object} boardLayout
   * @param {Number} row
   * @param {Number} column
   * @returns {String} characterId or 'free-space'
   */
  _getBoardLayoutSpace (boardLayout, row, column) {
    return boardLayout.row[row].column[column]
  }
}

module.exports = SequenceBoard
