import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/globals.css'

// Componente de fallback mientras cargan los componentes
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HeroUIProvider>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </HeroUIProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

