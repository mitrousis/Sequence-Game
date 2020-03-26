const Game = require('./Game')
const SequenceDeck = require('./SequenceDeck')
const SequenceBoard = require('./SequenceBoard')
/**
 * @typedef {import('./Player')} Player
 */

class SequenceGame extends Game {
  constructor () {
    super()

    this.gameType = 'sequence'

    // Game parameters
    this._minPlayerCount = 2
    this._maxPlayerCount = 4
    this._winningSequentialMatches = 4
    this._startingCardCount = 3

    // Internal
    this._deck = new SequenceDeck()
    this._board = new SequenceBoard()
  }

  startRound () {
    super.startRound()

    this._board.reset()

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
   * @param {Number} row
   * @param {Number} column
   * @param {Player} player
   * @param {Object} card
   */
  playSpace (row, column, player, card) {
    if (this.currentPlayer !== player) {
      throw Error('Invalid player for turn')
    }

    // Dragon = remove chip
    // Unicorn = any space

    this._board.playSpace(row, column, player, card)
  }
}

module.exports = SequenceGame
