const EventListener = require('events')
const { v4: uuidv4 } = require('uuid')

/**
 * Base game class for all game types. Currently doesn't do much
 */
class Game extends EventListener {
  constructor () {
    super()

    this._id = uuidv4()
  }

  /**
   * @returns {string} unique game id
   */
  get id () {
    return this._id
  }
}

module.exports = Game
