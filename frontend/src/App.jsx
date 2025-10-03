import { useState, useEffect, useRef } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import CompanyInput from './components/CompanyInput'
import WorkflowSelector from './components/WorkflowSelector'
import ExecutionProgress from './components/ExecutionProgress'
import AgentOutputCard from './components/AgentOutputCard'
import EmailPreviewCard from './components/EmailPreviewCard'
import ResultsSummary from './components/ResultsSummary'
import ErrorDisplay from './components/ErrorDisplay'
import LoadingAnimation from './components/LoadingAnimation'
import { checkBackendHealth, startFastAnalysis, startDeepAnalysis } from './services/api'

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

  const abortControllerRef = useRef(null)

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

  const handleStartAnalysis = async () => {
    if (!companyName.trim() || companyName.trim().length < 2) {
      setError('Please enter a valid company name (minimum 2 characters)')
      return
    }

    setIsAnalyzing(true)
    setProgress(0)
    setCurrentAgent(workflow === 'fast' ? 'Monitor Agent' : 'Monitor Agent')
    setCompletedAgents([])
    setResults(null)
    setError(null)

    abortControllerRef.current = new AbortController()

    // Start progress simulation
    const progressInterval = simulateProgress(workflow)

    try {
      const analysisFunc = workflow === 'fast' ? startFastAnalysis : startDeepAnalysis
      const result = await analysisFunc(companyName, abortControllerRef.current.signal)

      clearInterval(progressInterval)
      setProgress(100)
      setIsAnalyzing(false)
      setResults(result)
      setCurrentAgent(null)
    } catch (err) {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setProgress(0)
      setCurrentAgent(null)

      if (err.name === 'AbortError') {
        setError('Analysis stopped by user')
      } else {
        setError(err.message || 'Analysis failed. Please try again.')
      }
    }
  }

  const handleStopAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsAnalyzing(false)
      setProgress(0)
      setCurrentAgent(null)
      setError('Analysis stopped. Results may be incomplete.')
    }
  }

  const handleReset = () => {
    setCompanyName('')
    setWorkflow('fast')
    setResults(null)
    setError(null)
    setProgress(0)
    setCompletedAgents([])
    setCurrentAgent(null)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            🚨 Customer Sentiment Alert System
          </h1>
          <p className="text-xl text-gray-300">
            AI-Powered Real-Time Crisis Prevention
          </p>

          {/* Backend Status */}
          <div className="mt-4 flex items-center justify-center gap-2">
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
        </header>

        {/* Error Display */}
        {error && !isAnalyzing && (
          <ErrorDisplay
            error={error}
            onRetry={handleStartAnalysis}
            onDismiss={() => setError(null)}
          />
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

            <AgentOutputCard results={results} />

            <EmailPreviewCard results={results} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
