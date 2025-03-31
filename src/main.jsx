import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WebsitesProvider } from './contexts/WebsitesContext.jsx'

createRoot(document.getElementById('root')).render(
    <WebsitesProvider>
      <App />
    </WebsitesProvider>
)
