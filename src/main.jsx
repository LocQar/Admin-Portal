import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LocQarERP from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocQarERP />
  </StrictMode>,
)
