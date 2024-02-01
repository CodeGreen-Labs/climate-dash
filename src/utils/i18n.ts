import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import {
  auth_en,
  auth_zhTW,
  commit_en,
  commit_zhTW,
  common_en,
  common_zhTW,
  explorer_en,
  explorer_zhTW,
  kyc_en,
  kyc_zhTW,
  nav_en,
  nav_zhTW,
  rule_en,
  rule_zhTW,
  wallet_en,
  wallet_zhTW,
} from '@/locales'

// 加载英文时区信息
import('dayjs/locale/zh-tw')
import('dayjs/locale/en')

const initLang = () => {
  const savedLang = window.localStorage.getItem('locale')
  if (!savedLang) {
    window.localStorage.setItem('locale', 'en')
  }
  return savedLang || 'en'
}

i18n
  // init i18next
  .use(initReactI18next)
  .init({
    lng: initLang(),
    resources: {
      'zh-tw': {
        commit: commit_zhTW,
        common: common_zhTW,
        kyc: kyc_zhTW,
        nav: nav_zhTW,
        rule: rule_zhTW,
        explorer: explorer_zhTW,
        auth: auth_zhTW,
        wallet: wallet_zhTW,
      },
      en: {
        commit: commit_en,
        common: common_en,
        kyc: kyc_en,
        nav: nav_en,
        rule: rule_en,
        explorer: explorer_en,
        auth: auth_en,
        wallet: wallet_en,
      },
    },
    lowerCaseLng: true,
    fallbackLng: {
      default: ['en'],
    },
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
