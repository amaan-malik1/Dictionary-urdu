import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './config/firebase' // Initialize Firebase
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([/* your routes */], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
