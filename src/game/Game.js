const BaseGameElement = require('./BaseGameElement')
const Player = require('./Player')

/**
 * Base game class for all game types. Currently doesn't do much
 */
class Game extends BaseGameElement {
  constructor () {
    super()
    this.gameType = null

    this._openForPlayers = true
    this._roundActive = false
    this._roundWinner = null

    this._minPlayerCount = 2
    this._maxPlayerCount = 4

    /** @type {Array.<Player>} */
    this._players = []
    this._playerTurnIndex = -1
    this._playerStartIndex = -1
  }

  /**
   * Populates player data, overwrite as needed to create game specific player
   * @param {Object} playerData
   * @returns {Player}
   */
  _initializePlayer (playerData) {
    return new Player(playerData)
  }

  /**
   * "Waiting" for players / game to start
   */
  newRound () {
    if (this._roundActive) {
      throw Error('Game round already in progress')
    }
    this._openForPlayers = true
    this._roundWinner = null
  }

  /**
   * Call for next round to actually start
   */
  startRound () {
    if (this._players.length < this._minPlayerCount) {
      throw Error('Not enough players to start game')
    }

    this._roundActive = true
    this._openForPlayers = false

    // Assume player turn goes round-robin
    // TODO: handle turns if player leaves game
    this._playerStartIndex++
    this._playerStartIndex %= this._players.length
    // Next player's turn
    this._playerTurnIndex = this._playerStartIndex
  }

  /**
   *
   * @param {Object} playerData
   */
  addPlayer (playerData = {}) {
    if (this._players.length === this._maxPlayerCount) {
      throw Error(`Game cannot exceed ${this._maxPlayerCount} players`)
    }

    const player = this._initializePlayer(playerData)
    this._players.push(player)

    return player
  }

  /**
   *
   * @param {String} playerId
   * @returns {Player}
   */
  getPlayerById (playerId) {
    return this._players.find((player) => {
      return player.id === playerId
    })
  }

  /**
   * Reference the player id
   * @param {String} playerId
   */
  removePlayerById (playerId) {
    this._players.forEach((player, index) => {
      if (player.id === playerId) {
        this._players.splice(index)
      }
    })
  }

  _nextPlayer () {
    this._playerTurnIndex++
    this._playerTurnIndex %= this._players.length
  }

  _playerWinsRound (player) {
    this._roundWinner = player
    this._roundActive = false
  }

  /**
   * @returns {Player} current player
   */
  get currentPlayer () {
    return this._players[this._playerTurnIndex]
  }

  get openForPlayers () {
    return this._openForPlayers
  }
}

module.exports = Game
