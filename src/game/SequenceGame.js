const Game = require('./Game')
const SequenceDeck = require('./SequenceDeck')
const SequenceBoard = require('./SequenceBoard')
const SequencePlayer = require('./SequencePlayer')

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

    // Deal to all players, just doing 3 for each
    // not going around
    this._players.forEach((player) => {
      player.addCardsToHand(this._deck.deal(this._startingCardCount))
    })

    // At this point the game has started
  }

  /**
   *
   * @param {SequencePlayer} player
   * @param {SequenceCard} card
   * @param {Number} row
   * @param {Number} column
   */
  playCard (player, card, row, column) {
    if (this.currentPlayer !== player) {
      throw Error('Invalid player for turn')
    }

    // Will throw errors for invalid plays
    this._board.playCard(player, card, row, column)

    // Check winner
    if (this._board.isWinningPlayer(player, this._winningSequentialMatches, this._players)) {
      this._playerWinsRound(player)
    } else {
      // Discard the played card
      player.removeCardFromHand(card)

      // Return to deck
      this._deck.discard(card)

      // Deal one more
      player.addCardsToHand(this._deck.deal(1))

      // Advance player
      this._nextPlayer()
    }
  }

  _initializePlayer (playerData = {}) {
    return new SequencePlayer(playerData)
  }
}

module.exports = SequenceGame
