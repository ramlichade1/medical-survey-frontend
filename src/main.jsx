import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={3500}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss={false}
      limit={3}
      hideProgressBar={false}
      theme="light"
      toastClassName="medical-toast"
      bodyClassName="medical-toast-body"
      progressClassName="medical-toast-progress"
      style={{ width: "auto", maxWidth: "420px" }}
    />
  </StrictMode>,
)
