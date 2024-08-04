import { createServer } from 'node:http'
import { Server } from 'socket.io'

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
