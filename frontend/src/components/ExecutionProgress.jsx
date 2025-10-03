import { useEffect, useState } from 'react'
import { Loader2, StopCircle, CheckCircle2, Clock } from 'lucide-react'

function ExecutionProgress({ workflow, progress, currentAgent, completedAgents, onStop }) {
  const [elapsedTime, setElapsedTime] = useState(0)

  const agents = workflow === 'fast'
    ? ['Monitor Agent', 'Sentiment Analyzer', 'Response Coordinator', 'Executive Insights Generator']
    : ['Monitor Agent', 'Sentiment Analyzer', 'Priority Ranker', 'Context Investigator', 'Response Coordinator', 'Executive Insights Generator']

  const estimatedTime = workflow === 'fast' ? 18 : 35

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getAgentIcon = (agentName) => {
    const icons = {
      'Monitor Agent': '📡',
      'Sentiment Analyzer': '😊',
      'Priority Ranker': '🎯',
      'Context Investigator': '🔍',
      'Response Coordinator': '📧',
      'Executive Insights Generator': '✨'
    }
    return icons[agentName] || '🤖'
  }

  const getAgentStatus = (agentName) => {
    if (completedAgents.includes(agentName)) {
      return 'completed'
    } else if (currentAgent === agentName) {
      return 'active'
    } else {
      return 'pending'
    }
  }

  return (
    <div className="glass rounded-2xl p-8 shadow-2xl mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {workflow === 'fast' ? '⚡ Fast' : '🔍 Deep'} Analysis in Progress
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{elapsedTime}s elapsed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
          <span className="text-sm text-gray-400">
            ~{Math.max(0, estimatedTime - elapsedTime)}s remaining
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-purple-500 to-secondary transition-all duration-500 ease-out animate-gradient"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Agent Status */}
      {currentAgent && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            <div>
              <p className="font-medium text-blue-300">Currently Running</p>
              <p className="text-lg">
                {getAgentIcon(currentAgent)} {currentAgent}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Agent List */}
      <div className="space-y-3 mb-6">
        {agents.map((agent, index) => {
          const status = getAgentStatus(agent)
          const agentTime = completedAgents.includes(agent)
            ? Math.round((elapsedTime / completedAgents.length) * (completedAgents.indexOf(agent) + 1))
            : null

          return (
            <div
              key={agent}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                status === 'completed'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : status === 'active'
                  ? 'bg-blue-500/10 border border-blue-500/30 scale-105'
                  : 'bg-slate-800/30 border border-slate-700/30'
              }`}
            >
              <div className="text-2xl">
                {status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : status === 'active' ? (
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                ) : (
                  <Clock className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getAgentIcon(agent)}</span>
                  <span className="font-medium">{agent}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {status === 'completed' && agentTime && `${agentTime}s`}
                {status === 'active' && 'Running...'}
                {status === 'pending' && 'Waiting...'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stop Button */}
      <div className="flex justify-center">
        <button
          onClick={onStop}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
        >
          <StopCircle className="w-5 h-5" />
          STOP EXECUTION
        </button>
      </div>

      {/* Warning Note */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Stopping will abort the analysis. Results may be incomplete.
      </p>
    </div>
  )
}

export default ExecutionProgress
