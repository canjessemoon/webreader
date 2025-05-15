import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './sliderStyles.css' // Import custom slider styles
import './customSliders.css' // Import direct custom slider styles
import './contentStyles.css' // Import content-specific styles
import './criticalStyles.css' // Critical override styles 
import './fixPadding.css' // Emergency padding fixes with maximum specificity
import './allStatesStyles.css' // Styles for all content states
import './initialStateStyles.css' // Styles for initial empty state
import './rootStyles.css' // Root-level styles with highest specificity
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
