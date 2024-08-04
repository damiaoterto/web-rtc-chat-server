import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { PeerServer } from 'peer'

const SOCKET_EVENTS = {
  JOIN_ROOM: 'joinRoom',
  JOINED_ROOM: 'joinedRoom',
  LEAVE_ROOM: 'leaveRoom',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
}

const PEER_EVENTS = {
  CONNECT: 'connection',
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

  const io = socketServer.io
  const peer = peerServer.peer

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    const userId = socket.id

    console.log(`[Socket] User connected ${userId}`)

    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ room }) => {
      socket.join(room)
      console.log(`[Socket] User ${userId} joined on room ${room}`)
      io.to(room).emit(SOCKET_EVENTS.JOINED_ROOM, { userId })
    })

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ room }) => {
      socket.leave(room)
      console.log(`[Socket] User ${userId} leaves the room ${room}`)
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`[Socket] User disconnected ${userId}`)
    })
  })

  peer.on(PEER_EVENTS.CONNECT, (client) => {
    console.log(`[Peer] Peer user connected ${client.id}`)
  })

  peer.on(PEER_EVENTS.DISCONNECT, (client) => {
    console.log(`[Peer] Peer user disconnected ${client.id}`)
  })

  await Promise.all([
    socketServer.listen(),
    peerServer.listen(),
  ])
}
main()
