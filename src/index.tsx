import '@/utils/i18n'
import './index.scss'

import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)

postMessage({ payload: 'removeLoading' }, '*')
