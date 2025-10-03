import { AlertCircle, RefreshCw, X } from 'lucide-react'

function ErrorDisplay({ error, onRetry, onDismiss }) {
  const getSuggestions = (errorMessage) => {
    const suggestions = []

    if (errorMessage.toLowerCase().includes('backend') || errorMessage.toLowerCase().includes('not running')) {
      suggestions.push('Start the backend server: cd .. && python main.py')
      suggestions.push('Check that port 8000 is not in use')
      suggestions.push('Verify .env file has correct API keys')
    }

    if (errorMessage.toLowerCase().includes('tavily') || errorMessage.toLowerCase().includes('api key')) {
      suggestions.push('Add TAVILY_API_KEY to your .env file')
      suggestions.push('Get a free API key from tavily.com')
    }

    if (errorMessage.toLowerCase().includes('timeout') || errorMessage.toLowerCase().includes('slow')) {
      suggestions.push('Try the Fast workflow instead of Deep')
      suggestions.push('Check your internet connection')
    }

    if (errorMessage.toLowerCase().includes('stopped')) {
      suggestions.push('Analysis was stopped. Start a new analysis.')
    }

    if (suggestions.length === 0) {
      suggestions.push('Try again in a few moments')
      suggestions.push('Check browser console for details')
      suggestions.push('Ensure backend is running on port 8000')
    }

    return suggestions
  }

  const suggestions = getSuggestions(error)

  return (
    <div className="glass rounded-2xl p-6 border-2 border-red-500/30 bg-red-500/10 mb-8">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-red-300">Error Occurred</h3>
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <p className="text-gray-300 mb-4">{error}</p>

          {suggestions.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-300 mb-2">Suggestions:</p>
              <ul className="space-y-2">
                {suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-primary mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Analysis
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorDisplay
