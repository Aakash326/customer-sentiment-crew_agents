import { Zap, Search, Check } from 'lucide-react'

function WorkflowSelector({ selected, onChange, disabled }) {
  return (
    <div className="glass rounded-2xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Analysis Workflow</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Fast Workflow */}
        <button
          onClick={() => onChange('fast')}
          disabled={disabled}
          className={`relative p-6 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            selected === 'fast'
              ? 'border-primary bg-primary/20 scale-105 shadow-2xl'
              : 'border-purple-500/30 bg-slate-800/30 hover:border-primary/50 hover:scale-102'
          }`}
        >
          {selected === 'fast' && (
            <div className="absolute top-4 right-4">
              <Check className="w-6 h-6 text-green-400" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h3 className="text-2xl font-bold">Fast Analysis</h3>
          </div>

          <p className="text-gray-300 mb-4">
            Quick insights in 10-15 seconds
          </p>

          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>3 Agents</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Monitor + Sentiment Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Email Previews</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Real Internet Search</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-gray-400">
              ⚡ Best for: Quick response needs
            </p>
          </div>
        </button>

        {/* Deep Workflow */}
        <button
          onClick={() => onChange('deep')}
          disabled={disabled}
          className={`relative p-6 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            selected === 'deep'
              ? 'border-secondary bg-secondary/20 scale-105 shadow-2xl'
              : 'border-purple-500/30 bg-slate-800/30 hover:border-secondary/50 hover:scale-102'
          }`}
        >
          {selected === 'deep' && (
            <div className="absolute top-4 right-4">
              <Check className="w-6 h-6 text-green-400" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8 text-purple-400" />
            <h3 className="text-2xl font-bold">Deep Analysis</h3>
          </div>

          <p className="text-gray-300 mb-4">
            Comprehensive analysis in 25-35 seconds
          </p>

          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>5 Agents</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>All Fast features +</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Priority Ranking (0-100)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Pattern Investigation</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-gray-400">
              🔍 Best for: Strategic decisions
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default WorkflowSelector
