const CLIMATE_TOKEN_DRIVER_VERSION = '1.0.36'
const downloadFile = async (fileName: string) => {
  // check operating system
  const checkOS = () => {
    switch (process.platform) {
      case 'win32':
        return 'windows'
      case 'darwin':
        return 'macos'
      case 'linux':
        return 'linux'
      default:
        throw new Error('Unsupported operating system')
    }
  }
  const platform = checkOS()
  // check architecture
  const checkArch = () => {
    switch (process.arch) {
      case 'x64':
        return 'x64'
      case 'arm64':
        return 'arm64'
      default:
        throw new Error('Unsupported architecture')
    }
  }
  const arch = checkArch()

  const url = `https://github.com/Chia-Network/climate-token-driver/releases/download/${CLIMATE_TOKEN_DRIVER_VERSION}/${fileName}_${platform}_${CLIMATE_TOKEN_DRIVER_VERSION}_${arch}.zip`
  const fetch = (await import('node-fetch')).default

  const response = await fetch(url)
  if (!response.body) {
    throw new Error(`unexpected response ${response.statusText}`)
  }

  const AdmZip = (await import('adm-zip')).default
  const zip = new AdmZip(Buffer.from(await response.arrayBuffer()))
  const file = zip.getEntries()?.[0]

  zip.extractEntryTo(file, './dist-services', false, true, true, fileName)
}

const downloadClimateTokenDriver = async () => {
  await downloadFile('climate-token-driver')
}

const downloadClimateExplorerChia = async () => {
  await downloadFile('climate-explorer-chia')
}

downloadClimateTokenDriver()
downloadClimateExplorerChia()
