import { useState, useEffect, useRef } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Keyboard } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import CompanyInput from './components/CompanyInput'
import WorkflowSelector from './components/WorkflowSelector'
import ExecutionProgress from './components/ExecutionProgress'
import AgentOutputCard from './components/AgentOutputCard'
import EmailPreviewCard from './components/EmailPreviewCard'
import ResultsSummary from './components/ResultsSummary'
import ErrorDisplay from './components/ErrorDisplay'
import LoadingAnimation from './components/LoadingAnimation'
import AnalysisHistory from './components/AnalysisHistory'
import SentimentChart from './components/SentimentChart'
import ComparisonMode from './components/ComparisonMode'
import ComparisonResults from './components/ComparisonResults'
import ResultsFilter from './components/ResultsFilter'
import ExecutiveInsightsDashboard from './components/ExecutiveInsightsDashboard'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import ThemeToggle from './components/ThemeToggle'
import { checkBackendHealth, streamFastAnalysis, streamDeepAnalysis, compareCompanies } from './services/api'
import { filterResults } from './utils/filterUtils'
import { extractExecutiveInsights } from './utils/formatters'
import { toastConfig } from './utils/toastConfig'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useTheme } from './contexts/ThemeContext'

function App() {
  // State management
  const [companyName, setCompanyName] = useState('')
  const [workflow, setWorkflow] = useState('fast') // 'fast' or 'deep'
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentAgent, setCurrentAgent] = useState(null)
  const [completedAgents, setCompletedAgents] = useState([])
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [viewMode, setViewMode] = useState('single') // 'single' or 'comparison'
  const [comparisonResults, setComparisonResults] = useState(null)
  const [activeFilters, setActiveFilters] = useState(null)
  const [filteredResults, setFilteredResults] = useState(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const abortControllerRef = useRef(null)
  const { toggleTheme } = useTheme()

  // Check backend health on mount
  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      await checkBackendHealth()
      setBackendStatus('online')
    } catch (err) {
      setBackendStatus('offline')
      setError('Backend server is not running. Please start the backend with: python main.py')
    }
  }

  // Simulate progress updates
  const simulateProgress = (workflowType) => {
    const agents = workflowType === 'fast'
      ? ['Monitor Agent', 'Sentiment Analyzer', 'Response Coordinator']
      : ['Monitor Agent', 'Sentiment Analyzer', 'Priority Ranker', 'Context Investigator', 'Response Coordinator']

    const totalTime = workflowType === 'fast' ? 12000 : 30000 // 12s or 30s
    const timePerAgent = totalTime / agents.length

    let currentIndex = 0
    let currentProgress = 0

    const interval = setInterval(() => {
      currentProgress += (100 / agents.length) / (timePerAgent / 100)

      if (currentProgress >= ((currentIndex + 1) * (100 / agents.length))) {
        if (currentIndex < agents.length) {
          setCompletedAgents(prev => [...prev, agents[currentIndex]])
          currentIndex++
          if (currentIndex < agents.length) {
            setCurrentAgent(agents[currentIndex])
          }
        }
      }

      setProgress(Math.min(currentProgress, 99))

      if (currentProgress >= 99 || !isAnalyzing) {
        clearInterval(interval)
      }
    }, 100)

    return interval
  }

  const saveToHistory = (analysisResults) => {
    try {
      const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]')

      // Parse metrics from results
      const mentionsMatch = analysisResults.crew_output?.match(/(\d+)\s+mentions?/i)
      const criticalMatch = analysisResults.crew_output?.match(/(\d+)\s+critical/i)

      const historyItem = {
        company: analysisResults.company,
        workflow: analysisResults.workflow,
        processing_time: analysisResults.processing_time,
        mentions_count: mentionsMatch ? parseInt(mentionsMatch[1]) : 0,
        critical_count: criticalMatch ? parseInt(criticalMatch[1]) : 0,
        timestamp: new Date().toISOString(),
        results: analysisResults
      }

      // Add to beginning, keep last 10
      history.unshift(historyItem)
      localStorage.setItem('analysisHistory', JSON.stringify(history.slice(0, 10)))
    } catch (error) {
      console.error('Error saving to history:', error)
    }
  }

  const loadFromHistory = (historyItem) => {
    setResults(historyItem.results)
    setCompanyName(historyItem.company)
    setWorkflow(historyItem.workflow)
    setError(null)
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
    setCompanyName('')
    setProgress(0)
    setCurrentAgent(null)
    setCompletedAgents([])
    setActiveFilters(null)
    setFilteredResults(null)
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    // Cmd/Ctrl + Enter: Start analysis
    'cmd+enter': () => {
      if (!isAnalyzing && companyName.trim().length >= 2 && viewMode === 'single') {
        handleStartAnalysis()
      }
    },

    // ESC: Stop analysis or close modals
    'escape': () => {
      if (isAnalyzing) {
        handleStopAnalysis()
      } else if (showShortcuts) {
        setShowShortcuts(false)
      }
    },

    // Cmd/Ctrl + K: Focus company input
    'cmd+k': () => {
      const input = document.querySelector('input[type="text"]')
      if (input) {
        input.focus()
        input.select()
      }
    },

    // Cmd/Ctrl + N: New analysis (reset)
    'cmd+n': () => {
      if (!isAnalyzing) {
        handleReset()
        toast.success('Ready for new analysis', { icon: '🔄', duration: 2000 })
      }
    },

    // Cmd/Ctrl + /: Show shortcuts
    'cmd+/': () => {
      setShowShortcuts(true)
    },

    // Cmd/Ctrl + Shift + L: Toggle theme
    'cmd+shift+l': () => {
      toggleTheme()
    },

    // 1: Select Fast workflow
    '1': () => {
      if (!isAnalyzing && viewMode === 'single') {
        setWorkflow('fast')
        toast.success('Fast workflow selected', { icon: '⚡', duration: 1500 })
      }
    },

    // 2: Select Deep workflow
    '2': () => {
      if (!isAnalyzing && viewMode === 'single') {
        setWorkflow('deep')
        toast.success('Deep workflow selected', { icon: '🔍', duration: 1500 })
      }
    },
  }, [isAnalyzing, companyName, workflow, showShortcuts, viewMode])

  const handleStartAnalysis = async () => {
    if (!companyName.trim() || companyName.length < 2) {
      toast.error('Please enter a company name (minimum 2 characters)', { icon: '⚠️' })
      return
    }

    // Show loading toast
    toast.loading(`Starting ${workflow} analysis for ${companyName}...`, {
      id: 'analysis-start',
      duration: 2000
    })

    setIsAnalyzing(true)
    setError(null)
    setResults(null)
    setProgress(0)
    setCurrentAgent(null)
    setCompletedAgents([])

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      // Use streaming API with real progress updates
      const onProgress = (data) => {
        if (data.type === 'agent_start') {
          setCurrentAgent(data.agent)
          setProgress(data.progress)
        } else if (data.type === 'agent_complete') {
          setCompletedAgents(prev => [...prev, data.agent])
          setProgress(data.progress)
          setCurrentAgent(null)
        } else if (data.type === 'status') {
          setProgress(data.progress)
        }
      }

      let result
      if (workflow === 'fast') {
        result = await streamFastAnalysis(companyName, onProgress, controller.signal)
      } else {
        result = await streamDeepAnalysis(companyName, onProgress, controller.signal)
      }

      setResults(result)
      saveToHistory(result)
      setProgress(100)
      setIsAnalyzing(false)

      // Success toast
      toast.success(`${workflow === 'fast' ? '⚡ Fast' : '🔍 Deep'} analysis complete!`, {
        icon: '✅',
        duration: 3000
      })

    } catch (err) {
      console.error('Analysis error:', err)

      if (err.message === 'Analysis stopped by user' || err.message === 'Analysis stopped') {
        toast.error('Analysis stopped by user', { icon: '⏹️' })
      } else if (err.message.includes('Connection')) {
        toast.error('Lost connection to backend. Please check if the server is running.', {
          duration: 6000
        })
      } else {
        toast.error(`Analysis failed: ${err.message}`, { duration: 5000 })
      }

      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const handleStopAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsAnalyzing(false)
      setProgress(0)
      setCurrentAgent(null)
      toast.error('Analysis stopped. Results may be incomplete.', { icon: '⏹️' })
    }
  }

  const handleCompareCompanies = async (companies, workflow) => {
    try {
      const result = await compareCompanies(companies, workflow)
      setComparisonResults(result)
    } catch (error) {
      throw error
    }
  }

  const handleFilterChange = (filters) => {
    setActiveFilters(filters)
    if (results) {
      const filtered = filterResults(results, filters)
      setFilteredResults(filtered)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Toast Notifications */}
      <Toaster
        position={toastConfig.position}
        toastOptions={toastConfig}
        reverseOrder={false}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            🚨 Customer Sentiment Alert System
          </h1>
          <p className="text-xl text-gray-300">
            AI-Powered Real-Time Crisis Prevention
          </p>

          {/* Mode Toggle */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => {
                setViewMode('single')
                setComparisonResults(null)
              }}
              className={`px-6 py-2 rounded-lg transition-colors font-semibold ${
                viewMode === 'single'
                  ? 'bg-primary text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Single Analysis
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-6 py-2 rounded-lg transition-colors font-semibold ${
                viewMode === 'comparison'
                  ? 'bg-primary text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              Compare Companies
            </button>
          </div>

          {/* Backend Status & Theme Controls */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {backendStatus === 'checking' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                  <span className="text-sm text-gray-400">Checking backend...</span>
                </>
              )}
              {backendStatus === 'online' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Backend Online</span>
                </>
              )}
              {backendStatus === 'offline' && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Backend Offline</span>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <ThemeToggle />

              <button
                onClick={() => setShowShortcuts(true)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors"
                title="Keyboard Shortcuts (Cmd+/)"
              >
                <Keyboard className="w-4 h-4" />
                <span className="hidden md:inline">Shortcuts</span>
              </button>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {error && !isAnalyzing && (
          <ErrorDisplay
            error={error}
            onRetry={handleStartAnalysis}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Conditional Rendering Based on View Mode */}
        {viewMode === 'single' ? (
          <>
            {/* Analysis History */}
            {!isAnalyzing && !results && (
              <AnalysisHistory onSelectAnalysis={loadFromHistory} />
            )}

            {/* Main Content */}
            {!results && !isAnalyzing && (
              <div className="space-y-8">
                <CompanyInput
                  value={companyName}
                  onChange={setCompanyName}
                  disabled={backendStatus !== 'online'}
                />

                <WorkflowSelector
                  selected={workflow}
                  onChange={setWorkflow}
                  disabled={backendStatus !== 'online'}
                />

                <div className="flex justify-center">
                  <button
                    onClick={handleStartAnalysis}
                    disabled={backendStatus !== 'online' || !companyName.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    ▶️ Start Analysis
                  </button>
                </div>
              </div>
            )}

            {/* Execution Progress */}
            {isAnalyzing && (
              <>
                <LoadingAnimation
                  companyName={companyName}
                  currentAgent={currentAgent}
                  progress={progress}
                />
                <ExecutionProgress
                  workflow={workflow}
                  progress={progress}
                  currentAgent={currentAgent}
                  completedAgents={completedAgents}
                  onStop={handleStopAnalysis}
                />
              </>
            )}

            {/* Results Display */}
            {results && !isAnalyzing && (
              <div className="space-y-8">
                <ResultsSummary
                  results={results}
                  onNewAnalysis={handleReset}
                />

                {/* Executive Insights Dashboard - Show first for strategic overview */}
                {(() => {
                  const insights = extractExecutiveInsights(results.crew_output)
                  return insights ? (
                    <ExecutiveInsightsDashboard
                      insights={insights}
                      companyName={results.company}
                    />
                  ) : null
                })()}

                <SentimentChart results={results} />

                {/* Results Filter */}
                <ResultsFilter onFilterChange={handleFilterChange} />

                {/* Use filteredResults if filters are active, otherwise use results */}
                <AgentOutputCard results={filteredResults || results} />

                <EmailPreviewCard results={filteredResults || results} />
              </div>
            )}
          </>
        ) : (
          <>
            {/* Comparison Mode */}
            {!comparisonResults ? (
              <ComparisonMode
                onCompare={handleCompareCompanies}
                onBack={() => setViewMode('single')}
              />
            ) : (
              <ComparisonResults
                comparisonData={comparisonResults}
                onNewComparison={() => setComparisonResults(null)}
              />
            )}
          </>
        )}
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  )
}

export default App
