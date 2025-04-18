import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { EncounterProvider, useEncounterContext } from './encounter-context.jsx'

createRoot(document.getElementById('root')).render(
  <App />
)
