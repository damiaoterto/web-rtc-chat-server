import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { PeerServer } from 'peer'

const SOCKET_EVENTS = {
  JOIN_ROOM: 'joinRoom',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
}

const createSocketServer = () => {
  const httpServer = createServer()
  const io = new Server(httpServer)

  const listen = async (port = 3000) => {
    httpServer.listen(port, () => {
        console.log(`Http server listen on port ${port}`)
    })
  }

  return {
    io,
    listen,
  }
}

const createPeerServer = () => {
  const peer = new PeerServer({ path: '/peer' })

  const listen = async (port = 9090) => {
    peer.listen(port, () => {
      console.log(`Peer server listen on port ${port}`)
    })
  }

  return {
    peer,
    listen,
  }
}

async function main() {
  const socketServer = createSocketServer()
  const peerServer = createPeerServer()

  socketServer.io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`[Socket] User connected ${socket.id}`)

    socket.on(SOCKET_EVENTS.JOIN_ROOM, () => {

    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`[Socket] User disconnected ${socket.id}`)
    })
  })

  await Promise.all([
    socketServer.listen(),
    peerServer.listen(),
  ])
}
main()
