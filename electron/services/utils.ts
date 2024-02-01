import detect from 'detect-port'
import kill from 'kill-port'

export const killOnPort = (port: number | string, cb: () => void) => {
  port = Number(port)
  try {
    detect(port, async (_port) => {
      if (port !== _port) {
        console.log(`port: ${port} was not occupied`)
        cb()
      } else {
        console.log(`port: ${port} was occupied, restart it`)
        await kill(port, 'tcp')
        cb()
      }
    })
  } catch (error) {
    console.log(error)
  }
}
