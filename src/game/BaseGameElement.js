const { v4: uuidv4 } = require('uuid')
const EventListener = require('events')

class BaseGameElement extends EventListener {
  constructor () {
    super()
    this._id = uuidv4()
  }

  /**
   * @returns {String} unique id
   */
  get id () {
    return this._id
  }
}

module.exports = BaseGameElement
