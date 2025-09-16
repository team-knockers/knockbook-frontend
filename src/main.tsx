import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import './styles/index.css'
import "bootstrap/dist/css/bootstrap.min.css"

createRoot(document.getElementById('root')!).render(
  <App />
)
