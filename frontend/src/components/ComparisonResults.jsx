import { TrendingUp, AlertTriangle, Clock, Award, ArrowRight, Download } from 'lucide-react'
import { parseSentimentScore, parseMentionsCount } from '../utils/formatters'

export default function ComparisonResults({ comparisonData, onNewComparison }) {
  const { results, comparison_metrics } = comparisonData

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getBestPerformer = () => {
    let best = { company: '', score: 0, index: 0 }
    results.forEach((result, i) => {
      const score = parseSentimentScore(result.crew_output || '')
      if (score > best.score) {
        best = { company: result.company, score, index: i }
      }
    })
    return best
  }

  const bestPerformer = getBestPerformer()

  const exportComparison = () => {
    const data = {
      comparison_date: new Date().toISOString(),
      companies: results.map(r => ({
        name: r.company,
        sentiment_score: parseSentimentScore(r.crew_output || ''),
        mentions: parseMentionsCount(r.crew_output || ''),
        processing_time: r.processing_time
      }))
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comparison-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Comparison Results
            </h2>
            <p className="text-gray-400">
              Analyzed {results.length} companies using {comparisonData.workflow} workflow
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportComparison}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onNewComparison}
              className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg transition-colors"
            >
              New Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Best Performer Highlight */}
      <div className="glass rounded-xl p-6 border-2 border-green-500/50 bg-green-500/5">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold">Best Overall Performance</h3>
        </div>
        <p className="text-2xl font-bold text-green-400">
          {bestPerformer.company}
        </p>
        <p className="text-gray-400">
          Highest sentiment score: {bestPerformer.score}/100
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid md:grid-cols-3 gap-6">
        {results.map((result, index) => {
          const sentimentScore = parseSentimentScore(result.crew_output || '')
          const mentionsCount = parseMentionsCount(result.crew_output || '') || 0
          const isBest = index === bestPerformer.index

          return (
            <div
              key={index}
              className={`glass rounded-xl p-6 ${
                isBest ? 'border-2 border-green-500/30' : 'border border-white/10'
              }`}
            >
              {/* Company Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">{result.company}</h3>
                  {isBest && (
                    <Award className="w-6 h-6 text-green-400" />
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  {result.workflow} analysis
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                {/* Sentiment Score */}
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Sentiment Score</span>
                  </div>
                  <p className={`text-3xl font-bold ${getScoreColor(sentimentScore)}`}>
                    {sentimentScore}/100
                  </p>
                  <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${sentimentScore}%` }}
                    />
                  </div>
                </div>

                {/* Mentions */}
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-400">Total Mentions</span>
                  </div>
                  <p className="text-2xl font-bold">{mentionsCount}</p>
                </div>

                {/* Processing Time */}
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Processing Time</span>
                  </div>
                  <p className="text-lg font-semibold">{result.processing_time}</p>
                </div>
              </div>

              {/* View Details Button */}
              <button className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 transition-colors">
                View Full Report
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Comparative Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Comparative Analysis</h3>
        <div className="space-y-3">
          {results.map((result, index) => {
            const score = parseSentimentScore(result.crew_output || '')
            return (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{result.company}</span>
                  <span className={getScoreColor(score)}>{score}/100</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
