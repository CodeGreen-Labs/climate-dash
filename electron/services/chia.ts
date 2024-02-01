import { execFile } from 'child_process'
import { App } from 'electron'
import fs from 'fs'

import { killOnPort } from './utils'

export const PORT = 55400

export const onRunService = (app: App) => {
  let daemon
  switch (process.platform) {
    case 'darwin': {
      const daemonPath =
        'Chia.app/Contents/Resources/app.asar.unpacked/daemon/daemon'
      if (fs.existsSync(`/Applications/${daemonPath}`)) {
        daemon = `/Applications/${daemonPath}`
      }
      if (fs.existsSync(`${process.env.HOME}/Applications/${daemonPath}`)) {
        daemon = `${process.env.HOME}/Applications/${daemonPath}`
      }
      break
    }
    case 'win32': {
      const daemonPath =
        'Chia\\resources\\app.asar.unpacked\\daemon\\daemon.exe'
      if (fs.existsSync(`C:\\Program Files\\${daemonPath}`)) {
        daemon = `C:\\Program Files\\${daemonPath}`
      }
      if (
        fs.existsSync(
          `C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Programs\\${daemonPath}`
        )
      ) {
        daemon = `C:\\Users\\${process.env.USERNAME}\\AppData\\Local\\Programs\\${daemonPath}`
      }
      break
    }
    default:
      break
  }

  if (!daemon) {
    console.log('daemon not found')
    return
  }

  killOnPort(PORT, () => {
    console.log('daemon found at ', daemon)
    execFile(daemon)
  })

  app.on('before-quit', () => {
    killOnPort(PORT, () => {
      console.log('chia daemon was killed')
    })
  })
}
