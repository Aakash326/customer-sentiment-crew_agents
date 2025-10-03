import { useState, useEffect } from 'react'
import { Clock, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react'

export default function AnalysisHistory({ onSelectAnalysis }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('analysisHistory')
      if (saved) {
        const parsed = JSON.parse(saved)
        setHistory(parsed.slice(0, 10)) // Last 10 only
      }
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const clearHistory = () => {
    if (window.confirm('Clear all analysis history?')) {
      localStorage.removeItem('analysisHistory')
      setHistory([])
    }
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className="glass rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Recent Analyses
        </h3>
        <button
          onClick={clearHistory}
          className="text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectAnalysis(item)}
            className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-lg">{item.company}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.workflow === 'fast'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {item.workflow === 'fast' ? '⚡ Fast' : '🔍 Deep'}
                  </span>
                </div>

                <div className="flex gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.processing_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {item.mentions_count || 0} mentions
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    {item.critical_count || 0} critical
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
