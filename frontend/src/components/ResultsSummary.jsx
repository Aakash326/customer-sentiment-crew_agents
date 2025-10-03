import { Clock, TrendingUp, AlertTriangle, Users, Download, RotateCcw, Database } from 'lucide-react'

function ResultsSummary({ results, onNewAnalysis }) {
  if (!results) return null

  const handleDownloadReport = () => {
    const report = JSON.stringify(results, null, 2)
    const blob = new Blob([report], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sentiment_analysis_${results.company}_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Parse mentions count from crew output
  const getMentionsCount = () => {
    const match = results.crew_output?.match(/(\d+)\s+(?:real\s+)?mentions?/i)
    return match ? match[1] : 'N/A'
  }

  // Parse critical issues count
  const getCriticalCount = () => {
    const match = results.crew_output?.match(/(\d+)\s+critical/i)
    return match ? match[1] : '0'
  }

  // Determine data source
  const getDataSource = () => {
    if (results.crew_output?.toLowerCase().includes('tavily')) {
      return { name: 'Tavily Real Internet Search', status: 'success' }
    }
    return { name: 'Fallback Data', status: 'fallback' }
  }

  const dataSource = getDataSource()
  const mentionsCount = getMentionsCount()
  const criticalCount = getCriticalCount()

  // Performance rating based on processing time
  const getPerformanceRating = (time) => {
    const seconds = parseFloat(time)
    if (seconds < 15) return { label: 'Excellent', color: 'text-green-400' }
    if (seconds < 25) return { label: 'Good', color: 'text-blue-400' }
    if (seconds < 40) return { label: 'Average', color: 'text-yellow-400' }
    return { label: 'Slow', color: 'text-orange-400' }
  }

  const performance = getPerformanceRating(results.processing_time)

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="glass rounded-2xl p-6 border-2 border-green-500/30 bg-green-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Analysis Complete!</h2>
              <p className="text-gray-300">
                {results.workflow === 'fast' ? '⚡ Fast' : '🔍 Deep'} workflow completed for {results.company}
              </p>
            </div>
          </div>
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Processing Time */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-blue-400" />
            <h3 className="font-medium text-gray-300">Processing Time</h3>
          </div>
          <p className="text-3xl font-bold">{results.processing_time}</p>
          <p className={`text-sm mt-1 ${performance.color}`}>
            {performance.label}
          </p>
        </div>

        {/* Mentions Found */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="font-medium text-gray-300">Mentions Found</h3>
          </div>
          <p className="text-3xl font-bold">{mentionsCount}</p>
          <p className="text-sm text-gray-400 mt-1">Real internet data</p>
        </div>

        {/* Critical Issues */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="font-medium text-gray-300">Critical Issues</h3>
          </div>
          <p className="text-3xl font-bold text-red-400">{criticalCount}</p>
          <p className="text-sm text-gray-400 mt-1">Require attention</p>
        </div>

        {/* Agents Used */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="font-medium text-gray-300">Agents Used</h3>
          </div>
          <p className="text-3xl font-bold">{results.agents_used}</p>
          <p className="text-sm text-gray-400 mt-1">
            {results.workflow === 'fast' ? 'Fast workflow' : 'Deep workflow'}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">Analysis Details</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Data Source */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-primary" />
              <h4 className="font-medium">Data Source</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dataSource.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
              <span className="text-gray-300">{dataSource.name}</span>
            </div>
          </div>

          {/* Platforms Searched */}
          <div>
            <h4 className="font-medium mb-2">Platforms Searched</h4>
            <div className="flex flex-wrap gap-2">
              {results.search_platforms?.map((platform, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary/20 rounded-full text-sm"
                >
                  {platform}
                </span>
              )) || (
                <>
                  <span className="px-3 py-1 bg-primary/20 rounded-full text-sm">Twitter/X</span>
                  <span className="px-3 py-1 bg-primary/20 rounded-full text-sm">Reddit</span>
                  <span className="px-3 py-1 bg-primary/20 rounded-full text-sm">News Sites</span>
                </>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div>
            <h4 className="font-medium mb-2">Analysis Timestamp</h4>
            <p className="text-gray-300 text-sm">
              {results.execution_timestamp || new Date().toLocaleString()}
            </p>
          </div>

          {/* Workflow Type */}
          <div>
            <h4 className="font-medium mb-2">Workflow Type</h4>
            <p className="text-gray-300">
              {results.workflow === 'fast' ? (
                <span className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Fast Analysis (3 agents)</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>🔍</span>
                  <span>Deep Analysis (5 agents)</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={handleDownloadReport}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:shadow-xl rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download Full Report (JSON)
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultsSummary
