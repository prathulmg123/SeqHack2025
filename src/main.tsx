import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

// i18n
import './i18n'

// Polyfills
import 'intersection-observer'

// Global styles
import 'styles/index.css'

// Store
import store from 'store'

// Components
import CustomRouter from 'components/CustomRouter'
import Router from 'components/Router'

// Add an event listener for beforeunload to detect page reloads
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  // When page is about to reload, store the current path
  sessionStorage.setItem('isReloading', 'true')
}

// Add the event listener when the app starts
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', handleBeforeUnload)
}

// Component to handle redirection on page reload
const AppWithReloadHandler = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const isReloading = sessionStorage.getItem('isReloading') === 'true'
    
    if (isReloading && window.location.pathname !== '/') {
      // Clear the flag and redirect to home
      sessionStorage.removeItem('isReloading')
      window.location.href = '/'
    }
  }, [])

  return <>{children}</>
}

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement)
root.render(
  <CustomRouter>
    <Provider store={store}>
      <AppWithReloadHandler>
        <Router />
      </AppWithReloadHandler>
    </Provider>
  </CustomRouter>
)
