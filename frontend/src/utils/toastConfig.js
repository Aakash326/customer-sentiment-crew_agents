import toast from 'react-hot-toast'

/**
 * Custom toast configuration and styles
 */

export const toastConfig = {
  // Position
  position: 'top-right',

  // Duration
  duration: 4000,

  // Custom styles
  style: {
    background: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },

  // Success toast style
  success: {
    duration: 3000,
    style: {
      background: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },

  // Error toast style
  error: {
    duration: 5000,
    style: {
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },

  // Loading toast style
  loading: {
    style: {
      background: 'rgba(102, 126, 234, 0.15)',
      border: '1px solid rgba(102, 126, 234, 0.3)',
    },
  },
}

// Custom toast helpers
export const showSuccessToast = (message) => {
  return toast.success(message, toastConfig.success)
}

export const showErrorToast = (message) => {
  return toast.error(message, toastConfig.error)
}

export const showLoadingToast = (message) => {
  return toast.loading(message, toastConfig.loading)
}

export const showInfoToast = (message) => {
  return toast(message, {
    icon: 'ℹ️',
    style: {
      background: 'rgba(59, 130, 246, 0.15)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
  })
}
