const EventListener = require('events')
const SequenceGame = require('./SequenceGame')

/**
 * @typedef {import('./Game')} Game
 */

class GameManager extends EventListener {
  constructor () {
    super()

    this._activeGames = new Map()
  }

  /**
   * Does what it says
   * @param {string} gameType supported game type
   */
  startNewGame (gameType) {
    let newGameInstance

    switch (gameType) {
      case 'sequence':
        newGameInstance = new SequenceGame()
        break
    }

    if (!newGameInstance) {
      throw Error(`Game type "${gameType}" not found`)
    }

    this._activeGames.set(newGameInstance.id, newGameInstance)

    return newGameInstance
  }

  /**
   *
   * @param {string} gameId
   * @returns {Game} game instance
   */
  getGameById (gameId) {
    return this._activeGames.get(gameId) || null
  }

  // TODO
  // prune inactive games
}

module.exports = GameManager
