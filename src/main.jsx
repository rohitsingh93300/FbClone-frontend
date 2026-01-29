import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './components/ThemeProvider'
import { Provider } from 'react-redux'
import store from './redux/store'
import { Toaster } from 'sonner'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

const persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <App />
        <Toaster/>
      </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
