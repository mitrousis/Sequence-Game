const EventListener = require('events')
const { v4: uuidv4 } = require('uuid')
const Player = require('./Player')

/**
 * Base game class for all game types. Currently doesn't do much
 */
class Game extends EventListener {
  constructor () {
    super()
    this.gameType = null

    this._id = uuidv4()
    this._waitingForPlayers = true

    this._minPlayerCount = 2
    this._maxPlayerCount = 4

    /** @type {Array.<Player>} */
    this._players = []
    this._playerTurnIndex = -1
  }

  /**
   * "Waiting" for players / game to start
   */
  newRound () {
    this._openForPlayers = true
  }

  /**
   * Call for next round to actually start
   */
  startRound () {
    if (this._players.length < this._minPlayerCount) {
      throw Error('Not enough players to start game')
    }

    this._waitingForPlayers = false

    // Assume player turn goes round-robin
    // TODO: handle turns if player leaves game
    this._playerTurnIndex++
    this._playerTurnIndex %= this._players.length
  }

  /**
   * Player factory, pass in desired player subclass
   * @returns {Player} new player added to game
   */
  addPlayer (PlayerInstance = Player) {
    if (this._players.length === this._maxPlayerCount) {
      throw Error(`Game cannot exceed ${this._maxPlayerCount} players`)
    }

    const player = new PlayerInstance()
    this._players.push(player)

    return player
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

  /**
   * @returns {Player} current player
   */
  get currentPlayer () {
    return this._players[this._playerTurnIndex]
  }

  /**
   * @returns {String} unique game id
   */
  get id () {
    return this._id
  }

  get waitingForPlayers () {
    return this._waitingForPlayers
  }
}

module.exports = Game
