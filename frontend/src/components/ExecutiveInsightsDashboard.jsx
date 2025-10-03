import { useState } from 'react'
import {
  TrendingUp,
  AlertTriangle,
  Target,
  Lightbulb,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Share2
} from 'lucide-react'

export default function ExecutiveInsightsDashboard({ insights, companyName }) {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    actions: true,
    trends: false,
    recommendations: false,
    risk: true,
    opportunities: false
  })

  if (!insights) {
    return null
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Parse insights from text format
  const parseInsights = (insightsText) => {
    const sections = {}

    // Split by section headers
    const summaryMatch = insightsText.match(/1\.\s*EXECUTIVE SUMMARY[:\s]+(.*?)(?=2\.|$)/is)
    const actionsMatch = insightsText.match(/2\.\s*IMMEDIATE ACTION ITEMS[:\s]+(.*?)(?=3\.|$)/is)
    const trendsMatch = insightsText.match(/3\.\s*KEY TRENDS[:\s]+(.*?)(?=4\.|$)/is)
    const recommendationsMatch = insightsText.match(/4\.\s*STRATEGIC RECOMMENDATIONS[:\s]+(.*?)(?=5\.|$)/is)
    const riskMatch = insightsText.match(/5\.\s*(?:COMPREHENSIVE )?RISK ASSESSMENT[:\s]+(.*?)(?=6\.|$)/is)
    const opportunitiesMatch = insightsText.match(/6\.\s*OPPORTUNITIES[:\s]+(.*?)$/is)

    sections.summary = summaryMatch ? summaryMatch[1].trim() : ''
    sections.actions = actionsMatch ? parseListItems(actionsMatch[1]) : []
    sections.trends = trendsMatch ? parseListItems(trendsMatch[1]) : []
    sections.recommendations = recommendationsMatch ? parseListItems(recommendationsMatch[1]) : []
    sections.risk = riskMatch ? riskMatch[1].trim() : ''
    sections.opportunities = opportunitiesMatch ? parseListItems(opportunitiesMatch[1]) : []

    return sections
  }

  const parseListItems = (text) => {
    if (!text) return []

    // Split by bullet points or numbered items
    const items = text.split(/\n\s*[-•]\s*|\n\s*\d+\.\s*/)
      .map(item => item.trim())
      .filter(item => item.length > 0)

    return items
  }

  const extractRiskLevel = (riskText) => {
    if (riskText.includes('CRITICAL')) return 'critical'
    if (riskText.includes('HIGH')) return 'high'
    if (riskText.includes('MEDIUM')) return 'medium'
    return 'low'
  }

  const getRiskColor = (level) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 border-red-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      low: 'text-green-600 bg-green-50 border-green-200'
    }
    return colors[level] || colors.medium
  }

  const exportInsights = () => {
    const dataStr = JSON.stringify({ company: companyName, insights: insights }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `executive-insights-${companyName.toLowerCase().replace(/\s+/g, '-')}.json`
    link.click()
  }

  const parsed = parseInsights(insights)
  const riskLevel = extractRiskLevel(parsed.risk)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Executive Insights Dashboard</h2>
              <p className="text-indigo-100 text-sm">AI-Generated Strategic Intelligence for {companyName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportInsights}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(insights)}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Executive Summary */}
        <Section
          title="Executive Summary"
          icon={Target}
          color="indigo"
          expanded={expandedSections.summary}
          onToggle={() => toggleSection('summary')}
        >
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{parsed.summary}</p>
        </Section>

        {/* Immediate Action Items */}
        <Section
          title="Immediate Action Items"
          icon={AlertTriangle}
          color="red"
          expanded={expandedSections.actions}
          onToggle={() => toggleSection('actions')}
          badge={parsed.actions.length}
        >
          <div className="space-y-3">
            {parsed.actions.map((action, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <p className="text-gray-700 flex-1">{action}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Key Trends */}
        <Section
          title="Key Trends & Patterns"
          icon={TrendingUp}
          color="blue"
          expanded={expandedSections.trends}
          onToggle={() => toggleSection('trends')}
          badge={parsed.trends.length}
        >
          <div className="space-y-2">
            {parsed.trends.map((trend, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{trend}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Strategic Recommendations */}
        <Section
          title="Strategic Recommendations"
          icon={Lightbulb}
          color="yellow"
          expanded={expandedSections.recommendations}
          onToggle={() => toggleSection('recommendations')}
          badge={parsed.recommendations.length}
        >
          <div className="space-y-2">
            {parsed.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Risk Assessment */}
        <Section
          title="Risk Assessment"
          icon={Shield}
          color="purple"
          expanded={expandedSections.risk}
          onToggle={() => toggleSection('risk')}
        >
          <div className={`p-4 border-2 rounded-lg ${getRiskColor(riskLevel)}`}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" />
              <span className="font-bold uppercase text-sm">Overall Risk: {riskLevel}</span>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{parsed.risk}</p>
          </div>
        </Section>

        {/* Opportunities */}
        <Section
          title="Opportunities & Silver Linings"
          icon={Sparkles}
          color="green"
          expanded={expandedSections.opportunities}
          onToggle={() => toggleSection('opportunities')}
          badge={parsed.opportunities.length}
        >
          <div className="space-y-2">
            {parsed.opportunities.map((opp, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{opp}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI-generated insights powered by GPT-4. Review with human judgment before taking action.
        </p>
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, color, expanded, onToggle, badge, children }) {
  const colorClasses = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700'
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${colorClasses[color]}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-semibold">{title}</span>
          {badge !== undefined && (
            <span className="px-2 py-0.5 bg-white rounded-full text-xs font-bold">
              {badge}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {expanded && (
        <div className="p-4 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}
