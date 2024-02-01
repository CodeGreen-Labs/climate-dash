import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface PaletteColor {
    background?: string
  }

  interface SimplePaletteColorOptions {
    background?: string
  }

  interface Palette {
    table?: {
      row?: {
        even?: string
        odd?: string
        hover?: string
      }
      error?: {
        fill?: string
      }
    }
  }

  interface PaletteOptions {
    table?: {
      row?: {
        even?: string
        odd?: string
        hover?: string
      }
      error?: {
        fill?: string
      }
    }
  }
}
