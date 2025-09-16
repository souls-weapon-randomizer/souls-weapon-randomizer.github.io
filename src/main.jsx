import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NotificationContainer } from './components/NotificationManager'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Render notifications in a separate root to avoid affecting main app
const notificationsRoot = document.getElementById('notifications-root');
if (notificationsRoot) {
  createRoot(notificationsRoot).render(
    <StrictMode>
      <NotificationContainer />
    </StrictMode>,
  );
}
