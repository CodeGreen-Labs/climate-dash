import fs from 'fs'
import yaml from 'js-yaml'
import os from 'os'
import path from 'path'

import packageJson from '../../package.json'

const version = packageJson.version

interface Config {
  dataLayerEndPoint: string
  dataLayerApiKey: string
  climateTokenDriverUrl: string
  climateExplorerChiaUrl: string
  network: string
  apiCallTimeout: number
  version: string
}

const defaultConfig: Config = {
  dataLayerEndPoint: import.meta.env.VITE_DATA_LAYER_END_POINT,
  dataLayerApiKey: import.meta.env.VITE_DATA_LAYER_API_KEY,
  climateTokenDriverUrl: import.meta.env.VITE_CLIMATE_TOKEN_DRIVER_URL,
  climateExplorerChiaUrl: import.meta.env.VITE_CLIMATE_EXPLORER_CHIA_URL,
  network: import.meta.env.VITE_NETWORK,
  apiCallTimeout: Number(import.meta.env.VITE_API_CALL_TIMEOUT || 60000),
  version,
}

const homeDir = os.homedir()
const persistanceFolderPath = `${homeDir}/.chia/mainnet/climate-dash`
const configFilePath = path.resolve(`${persistanceFolderPath}/config.yaml`)

export const getConfig = (): Config => {
  try {
    if (!fs.existsSync(configFilePath)) {
      try {
        if (!fs.existsSync(persistanceFolderPath)) {
          fs.mkdirSync(persistanceFolderPath, { recursive: true })
        }

        fs.writeFileSync(configFilePath, yaml.dump(defaultConfig), 'utf8')
      } catch (err) {
        return defaultConfig
      }
    }

    try {
      const yml = yaml.load(fs.readFileSync(configFilePath, 'utf8'))
      return yml as Config
    } catch (e) {
      console.log(`Config file not found at ${configFilePath}`, e)
      return defaultConfig
    }
  } catch (e) {
    console.log(`Config file not found at ${configFilePath}`, e)

    return defaultConfig
  }
}

export const updateConfig = (updates: Config) => {
  try {
    const currentConfig = getConfig()
    const updatedConfig = { ...currentConfig, ...updates }
    fs.writeFileSync(configFilePath, yaml.dump(updatedConfig), 'utf8')
  } catch (e) {
    console.log(`Could not update config file`, e)
  }
}

export const checkConfig = () => {
  const configVersion = getConfig().version || '0.0.0'

  if (version > configVersion) {
    updateConfig({
      ...defaultConfig,
      ...getConfig(),
      version,
    })
  }
}
