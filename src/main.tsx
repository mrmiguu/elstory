import LogRocket from 'logrocket'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import { log } from './utils'

if (import.meta.env.DEV) log('DEV mode')
if (import.meta.env.PROD) LogRocket.init('elstory/elstory')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
)
