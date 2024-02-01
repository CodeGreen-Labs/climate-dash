import fs from 'fs'
import yaml from 'js-yaml'
import { get } from 'lodash'
import os from 'os'
import path from 'path'

const homeDir = os.homedir()

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const untildify = (pathWithTilde: string) => {
  return homeDir
    ? pathWithTilde.replace(/^~(?=$|\/|\\)/, homeDir)
    : pathWithTilde
}

export const getConfigRootDir = (net: 'mainnet' = 'mainnet') => {
  return 'CHIA_ROOT' in process.env && process.env.CHIA_ROOT
    ? untildify(process.env.CHIA_ROOT)
    : path.join(homeDir, '.chia', net)
}

export const readConfigFile = (net: 'mainnet' = 'mainnet') => {
  const configRootDir = getConfigRootDir(net)

  return yaml.load(
    fs.readFileSync(path.resolve(configRootDir, 'config/config.yaml'), 'utf8')
  )
}

export const loadConfig = async (net: 'mainnet' = 'mainnet') => {
  try {
    const config = readConfigFile(net)

    const selfHostname = get(config, 'ui.daemon_host', 'localhost')
    const daemonPort = get(config, 'ui.daemon_port', 55400)

    const url = `wss://${selfHostname}:${daemonPort}`
    const configRootDir = getConfigRootDir(net)

    const certPath = path.resolve(
      configRootDir,
      get(
        config,
        'ui.daemon_ssl.private_crt',
        'config/ssl/daemon/private_daemon.crt'
      )
    )
    const keyPath = path.resolve(
      configRootDir,
      get(
        config,
        'ui.daemon_ssl.private_key',
        'config/ssl/daemon/private_daemon.key'
      )
    )

    return {
      url,
      cert: fs.readFileSync(certPath).toString(),
      key: fs.readFileSync(keyPath).toString(),
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Waiting for configuration file')
      await sleep(1000)
      return loadConfig(net)
    } else {
      throw error
    }
  }
}
