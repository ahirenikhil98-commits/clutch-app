import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Clutch from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Clutch />
  </StrictMode>,
)
