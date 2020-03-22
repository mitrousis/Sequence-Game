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
    this._winningSequentialMatches = 4
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
    if (this._isFreeSpace(this._boardState, row, column)) isValidMove = false

    // Can't place on existing square
    if (this._boardState.row[row].column[column] !== null) {
      isValidMove = false
    }

    if (!isValidMove) throw Error('Invalid move')

    // Put the playerId in that spot
    this._boardState.row[row].column[column] = playerId
  }

  _checkWinningBoardState (boardState) {
    for (let row = 0; row < this._rows; row++) {
      for (let column = 0; column < this._columns; column++) {
        const foundValidSequence = this._checkBoardSpace(boardState, row, column, this.currentPlayer)
        if (foundValidSequence) {
          console.log(this.currentPlayer, 'wins')
        }
      }
    }
  }

  // _checkBoardSpace (boardState, row, column, playerId, direction, iteration = 0) {

  // }

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
          // if (sequentialMatches === maxIterations) return true
        }
      }
    }

    // Found nothing
    return maxSequentialIterations

    //   // Don't check yo'self
    //   if (checkRow !== homeRow && checkColumn !== homeColumn) {
    //     // Found a valid spot
    //     if (this._isFreeSpace(checkRow, checkColumn) || boardState.row[checkRow].column[checkColumn] === playerId) {
    //       isValidMatch = true
    //     }
    //   }
    // }

    //  if(boardState.row[homeRow] && boardState.row[homeColumn].column[checkColumn]) {

    //       let isValidMatch = false

    //       // Ensure this is a valid spot
    //       if (boardState.row[checkRow] && boardState.row[checkRow].column[checkColumn]) {
    //         // Don't check yo'self
    //         if (checkRow !== homeRow && checkColumn !== homeColumn) {
    //           // Found a valid spot
    //           if (this._isFreeSpace(checkRow, checkColumn) || boardState.row[checkRow].column[checkColumn] === playerId) {
    //             isValidMatch = true
    //           }
    //         }
    //       }

    //       let foundNeighbors = 0

    //       if (isValidMatch) {
    //         const checkDirection = direction || `${rowOffset},${columnOffset}`
    //         foundNeighbors = this._checkBoardNeighbors(boardState, checkRow, checkColumn, playerId, checkDirection, iteration + 1)

    //         if(foundNeighbors === 4) !!!
    //       } else if (iteration !== 0) {
    //         return iteration
    //       } else {

    //       }

    // // If headed in a direction, recursively keep going
    // if (direction) {
    //   if (isValidMatch) {
    //     // const startDirection =
    //     return this._checkBoardNeighbors(boardState, checkRow, checkColumn, playerId, direction, iteration + 1)
    //   } else {
    //     return iteration
    //   }
    // } else {
    //   this._checkBoardNeighbors(boardState, rowOffset, columnOffset, playerId, direction, count + 1)
    // }

    // matchedNeighbors.push({
    //   row: rowOffset,
    //   column: columnOffset
    // })
    //   }
    // }

    // return matchedNeighbors
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
