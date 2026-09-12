import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "./context/authContext"
import "./styles/global.css"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.warn("VITE_GOOGLE_CLIENT_ID is not set — Google sign-in will be unavailable.");
}

const app = (
  <AuthProvider>
    <App />
  </AuthProvider>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        {app}
      </GoogleOAuthProvider>
    ) : (
      app
    )}
  </React.StrictMode>,
)