import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import App from './App.jsx'
import { AppContextProvider } from './context/AppContex.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = createRoot(document.getElementById('root'))

if (PUBLISHABLE_KEY) {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={'/'}>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </ClerkProvider>
      </BrowserRouter>
    </StrictMode>,
  )
} else {
  // In development allow the app to run without Clerk configured — avoid throwing
  // which prevents the entire app from rendering (white screen).
  // eslint-disable-next-line no-console
  console.warn('VITE_CLERK_PUBLISHABLE_KEY not found — rendering without ClerkProvider')

  root.render(
    <StrictMode>
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </StrictMode>,
  )

}
