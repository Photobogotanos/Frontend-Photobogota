import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-center"
      containerStyle={{
        top: "max(20px, env(safe-area-inset-top))",
      }}
      toastOptions={{
        duration: 3500,
        style: {
          fontSize: "0.95rem",
          fontWeight: "600",
          padding: "12px 14px 12px 18px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          maxWidth: "min(92vw, 420px)",
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="toast-content">
              {icon}
              <span className="toast-message">{message}</span>
              {t.type !== "loading" && (
                <button
                  type="button"
                  className="toast-close-btn"
                  aria-label="Cerrar notificación"
                  onClick={() => toast.dismiss(t.id)}
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
