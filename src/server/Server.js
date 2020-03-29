const express = require('express')
const http = require('http')
const SocketIO = require('socket.io')

class Server {
  constructor () {
    this._app = express()
    // this._app.use(express.static('./public'))

    this._server = http.Server(this._app)
    this._server.listen(process.env.PORT || 8080)

    this._socketServer = new SocketIO(this._server)

    this._socketServer.on('connection', client => {
      console.log(`Client ${client.id} connected`)

      // client.on('getTime', () => {
      //   const serverTime = performance.now()
      //   client.emit('setTime', serverTime)
      // })
    })
  }
}

module.exports = Server
