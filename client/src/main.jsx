import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {AuthProvider} from "./context/AuthContext.jsx";
import {UtilProvider} from "./context/UtilContext.jsx";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <UtilProvider>
          <AuthProvider>
              <App/>
          </AuthProvider>
      </UtilProvider>
  </StrictMode>,
)
