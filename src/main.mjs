import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { PeerServer } from 'peer'

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

  const listen = async (port = 9000) => {
    peer.listen(port, () => {
      console.log(`Peer server listen on port ${port}`)
    })
  }

  return {
    peer,
    listen,
  }
}
