import { execFile } from 'child_process'
import { type App } from 'electron'
import path from 'path'

import { killOnPort } from './utils'

export const onRunServiceProcess = (app: App, port, serviceFileName) => {
  killOnPort(port, () => {
    const script = path.join(
      __dirname,
      `../../dist-services/${serviceFileName}`
    )
    const child = execFile(script)
    child.stdout.on('data', (data) => {
      console.log(`[${serviceFileName}]: ${data}`)
    })
    child.stderr.on('data', (data) => {
      console.error(`[${serviceFileName}]: ${data}`)
    })
  })

  app.on('before-quit', () => {
    killOnPort(port, () => {
      console.log(`${serviceFileName} was killed`)
    })
  })
}

export const onRunService = (app: App) => {
  // run climate-token-driver and climate-explorer-chia

  const services = [
    {
      port: process.env.CLIMATE_TOKEN_DRIVER_PORT || 31314,
      fileName: 'climate-token-driver',
      url: import.meta.env.VITE_CLIMATE_TOKEN_DRIVER_URL,
    },
    {
      port: process.env.CLIMATE_EXPLORER_CHIA_PORT,
      fileName: 'climate-explorer-chia',
      url: import.meta.env.VITE_CLIMATE_EXPLORER_CHIA_URL,
    },
  ]

  services.forEach(({ port, fileName, url }) => {
    if (port && url.includes('localhost')) {
      onRunServiceProcess(app, port, fileName)
    }
  })
}
