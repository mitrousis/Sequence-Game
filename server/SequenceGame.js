const EventListener = require('events')
const { v4: uuidv4 } = require('uuid')

class SequenceGame extends EventListener {
  constructor () {
    super()

    this._rows = 7
    this._columns = 6
    this._playerIds = []
    this._boardState = {}
    this._playerTurnIndex = -1
  }

  newRound () {
    this._boardState = this._getEmptyBoardState(this._rows, this._columns)

    // Assume player turn goes round-robin
    this._playerTurnIndex++
    this._playerTurnIndex %= this._playerIds.length
  }

  updateBoard (row, column, playerId) {
    const expectedPlayerId = this._playerIds[this._playerTurnIndex]
    if (playerId !== expectedPlayerId) {
      throw Error('Invalid player for turn')
    }

    let isValidMove = true
    // Can't place on corners
    if (this._isFreeSpace(row, column)) isValidMove = false

    // Can't place on existing square
    if (this._boardState.row[row].column[column] !== null) {
      isValidMove = false
    }

    if (!isValidMove) throw Error('Invalid move')

    // Put the playerId in that spot
    this._boardState.row[row].column[column] = playerId
  }

  _checkWinningBoardState (boardState) {

  }

  // Left off here - need to make this recursive
  _checkBoardNeighbors (boardState, homeRow, homeColumn, playerId, count = 0) {
    const matchedNeighbors = []

    for (let row = homeRow - 1; row <= homeRow + 1; row++) {
      for (let column = homeColumn - 1; column <= homeColumn + 1; column++) {
        // Ensure this is a valid spot
        if (boardState.row[row] && boardState.row[row].column[column]) {
          // Don't check yourself
          if (row !== homeRow && column !== homeColumn) {
            if (this._isFreeSpace(row, column) || boardState.row[row].column[column] === playerId) {
              matchedNeighbors.push({
                row,
                column
              })
            }
          }
        }
      }
    }

    return matchedNeighbors
  }

  _isFreeSpace (row, column) {
    if (row === 0) {
      if (column === 0 || column === this._columns - 1) {
        return true
      }
    } else if (row === this._rows - 1) {
      if (column === 0 || column === this._columns - 1) {
        return true
      }
    }

    return false
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

  /**
   * @returns {string} unique playerId
   */
  addPlayer () {
    const playerId = uuidv4()
    this._playerIds.push(playerId)
    return playerId
  }

  get currentPlayer () {
    return this._playerIds[this._playerTurnIndex]
  }

  // _shuffleDeck () {

  // }

  // /**
  //  *
  //  * @param {number} index
  //  * @returns {object} row, column
  //  */
  // _getRowColumnForIndex (index) {
  //   return {
  //     row: index % this._rows,
  //     column: Math.floor(index / this._columns)
  //   }
  // }
}

module.exports = SequenceGame
