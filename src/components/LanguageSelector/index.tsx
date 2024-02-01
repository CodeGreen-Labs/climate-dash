import LanguageIcon from '@mui/icons-material/Language'
import { IconButton, MenuItem } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import StyledMenu from '@/components/StyledMenu'
interface Language {
  code: string
  name: string
}
const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'zh-tw', name: '繁體中文' },
]

const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<any>(null)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (selectedLanguage: string) => {
    handleClose()
    i18n.changeLanguage(selectedLanguage)
    window.localStorage.setItem('locale', selectedLanguage)
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <LanguageIcon />
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            value={language.code}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.name}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  )
}

export default LanguageSelector
