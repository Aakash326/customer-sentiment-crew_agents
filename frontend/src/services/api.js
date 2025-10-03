/**
 * API Service for Customer Sentiment Alert System
 * Handles all communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Check if backend server is healthy and running
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Backend health check failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Backend health check error:', error)
    throw new Error('Backend server is not responding. Please ensure it is running on port 8000.')
  }
}

/**
 * Start fast sentiment analysis (3 agents)
 * @param {string} companyName - Name of the company to analyze
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 */
export const startFastAnalysis = async (companyName, signal = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/fast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_name: companyName }),
      signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Analysis failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fast analysis error:', error)

    // Handle abort
    if (error.name === 'AbortError') {
      throw error
    }

    // Handle network errors
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Please ensure the server is running.')
    }

    throw error
  }
}

/**
 * Start deep sentiment analysis (5 agents)
 * @param {string} companyName - Name of the company to analyze
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 */
export const startDeepAnalysis = async (companyName, signal = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/deep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_name: companyName }),
      signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Analysis failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Deep analysis error:', error)

    // Handle abort
    if (error.name === 'AbortError') {
      throw error
    }

    // Handle network errors
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Please ensure the server is running.')
    }

    throw error
  }
}

/**
 * Get list of supported companies and usage guidance
 */
export const getSupportedCompanies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/supported-companies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch supported companies')
    }

    return await response.json()
  } catch (error) {
    console.error('Supported companies error:', error)
    // Return default list on error
    return {
      supported: ['Apple', 'Google', 'Microsoft', 'Tesla', 'Amazon'],
      note: 'System can analyze any company - these are just examples'
    }
  }
}

/**
 * Get system information
 */
export const getSystemInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch system info')
    }

    return await response.json()
  } catch (error) {
    console.error('System info error:', error)
    throw new Error('Cannot fetch system information')
  }
}

/**
 * Start fast analysis with real-time streaming
 * @param {string} companyName - Company to analyze
 * @param {Function} onProgress - Callback for progress updates
 * @param {AbortSignal} signal - Abort signal
 */
export const streamFastAnalysis = async (companyName, onProgress, signal = null) => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/analyze/fast/stream?company_name=${encodeURIComponent(companyName)}`
    )

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'complete') {
          eventSource.close()
          resolve(data.results)
        } else if (data.type === 'error') {
          eventSource.close()
          reject(new Error(data.message))
        } else {
          // Progress update
          onProgress(data)
        }
      } catch (error) {
        eventSource.close()
        reject(error)
      }
    }

    eventSource.onerror = (error) => {
      eventSource.close()
      reject(new Error('Connection to server lost'))
    }

    // Handle abort
    if (signal) {
      signal.addEventListener('abort', () => {
        eventSource.close()
        reject(new Error('Analysis stopped by user'))
      })
    }
  })
}

/**
 * Start deep analysis with real-time streaming
 */
export const streamDeepAnalysis = async (companyName, onProgress, signal = null) => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/analyze/deep/stream?company_name=${encodeURIComponent(companyName)}`
    )

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'complete') {
          eventSource.close()
          resolve(data.results)
        } else if (data.type === 'error') {
          eventSource.close()
          reject(new Error(data.message))
        } else {
          onProgress(data)
        }
      } catch (error) {
        eventSource.close()
        reject(error)
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
      reject(new Error('Connection lost'))
    }

    if (signal) {
      signal.addEventListener('abort', () => {
        eventSource.close()
        reject(new Error('Analysis stopped'))
      })
    }
  })
}

/**
 * Compare multiple companies
 * @param {string[]} companyNames - Array of 2-3 company names
 * @param {string} workflow - 'fast' or 'deep'
 */
export const compareCompanies = async (companyNames, workflow = 'fast') => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_names: companyNames,
        workflow: workflow
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Comparison failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Comparison error:', error)
    throw error
  }
}
