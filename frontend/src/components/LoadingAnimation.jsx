import { Loader2 } from 'lucide-react'

function LoadingAnimation({ companyName, currentAgent, progress }) {
  const messages = {
    'Monitor Agent': 'Searching real internet data...',
    'Sentiment Analyzer': 'Analyzing sentiment patterns...',
    'Priority Ranker': 'Calculating business impact...',
    'Context Investigator': 'Investigating root causes...',
    'Response Coordinator': 'Generating email previews...'
  }

  const message = currentAgent ? messages[currentAgent] : 'Initializing...'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="glass rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl">
        {/* Animated Circle */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-spin-slow"></div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-4 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse-slow flex items-center justify-center">
            <div className="text-6xl">🚨</div>
          </div>

          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="92"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary"
              strokeDasharray={`${2 * Math.PI * 92}`}
              strokeDashoffset={`${2 * Math.PI * 92 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
        </div>

        {/* Company Name */}
        <h3 className="text-2xl font-bold text-center mb-2 gradient-text">
          Analyzing {companyName}
        </h3>

        {/* Progress Percentage */}
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-white">{Math.round(progress)}%</span>
        </div>

        {/* Current Message */}
        <div className="flex items-center justify-center gap-3 text-gray-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-lg">{message}</span>
        </div>

        {/* Agent Icons Animation */}
        <div className="flex justify-center gap-4 mt-8">
          {['📡', '😊', '🎯', '🔍', '📧'].map((icon, i) => (
            <div
              key={i}
              className="text-3xl animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                opacity: progress > (i * 20) ? 1 : 0.3
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation
