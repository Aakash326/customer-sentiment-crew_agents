import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'

function AgentOutputCard({ results }) {
  const [expandedSections, setExpandedSections] = useState({})
  const [copiedSection, setCopiedSection] = useState(null)

  if (!results?.crew_output) return null

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCopy = (text, section) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  // Parse agent outputs from crew_output
  const parseAgentOutputs = (crewOutput) => {
    // Split by common agent markers
    const sections = []

    // Monitor Agent
    if (crewOutput.includes('Monitor Agent') || crewOutput.includes('📡')) {
      const monitorMatch = crewOutput.match(/(?:Monitor Agent|📡)[^\n]*\n([\s\S]*?)(?=(?:Sentiment|😊|Priority|🎯|Context|🔍|Response|📧)|$)/i)
      if (monitorMatch) {
        sections.push({
          name: 'Monitor Agent',
          icon: '📡',
          color: 'blue',
          output: monitorMatch[1].trim()
        })
      }
    }

    // Sentiment Analyzer
    if (crewOutput.includes('Sentiment') || crewOutput.includes('😊')) {
      const sentimentMatch = crewOutput.match(/(?:Sentiment|😊)[^\n]*\n([\s\S]*?)(?=(?:Priority|🎯|Context|🔍|Response|📧)|$)/i)
      if (sentimentMatch) {
        sections.push({
          name: 'Sentiment Analyzer',
          icon: '😊',
          color: 'green',
          output: sentimentMatch[1].trim()
        })
      }
    }

    // Priority Ranker (Deep only)
    if (crewOutput.includes('Priority') || crewOutput.includes('🎯')) {
      const priorityMatch = crewOutput.match(/(?:Priority|🎯)[^\n]*\n([\s\S]*?)(?=(?:Context|🔍|Response|📧)|$)/i)
      if (priorityMatch) {
        sections.push({
          name: 'Priority Ranker',
          icon: '🎯',
          color: 'orange',
          output: priorityMatch[1].trim()
        })
      }
    }

    // Context Investigator (Deep only)
    if (crewOutput.includes('Context') || crewOutput.includes('🔍')) {
      const contextMatch = crewOutput.match(/(?:Context|🔍)[^\n]*\n([\s\S]*?)(?=(?:Response|📧)|$)/i)
      if (contextMatch) {
        sections.push({
          name: 'Context Investigator',
          icon: '🔍',
          color: 'purple',
          output: contextMatch[1].trim()
        })
      }
    }

    // Response Coordinator
    if (crewOutput.includes('Response') || crewOutput.includes('📧')) {
      const responseMatch = crewOutput.match(/(?:Response|📧)[^\n]*\n([\s\S]*?)$/i)
      if (responseMatch) {
        sections.push({
          name: 'Response Coordinator',
          icon: '📧',
          color: 'pink',
          output: responseMatch[1].trim()
        })
      }
    }

    // If no sections found, return full output as single section
    if (sections.length === 0) {
      sections.push({
        name: 'Analysis Results',
        icon: '📊',
        color: 'blue',
        output: crewOutput
      })
    }

    return sections
  }

  const agentSections = parseAgentOutputs(results.crew_output)

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold gradient-text mb-6">
        🤖 Agent Outputs
      </h2>

      {agentSections.map((section, index) => {
        const isExpanded = expandedSections[section.name] !== false // Default to expanded
        const isCopied = copiedSection === section.name

        return (
          <div
            key={index}
            className={`glass rounded-xl overflow-hidden border-2 ${getColorClasses(section.color)}`}
          >
            {/* Header */}
            <button
              onClick={() => toggleSection(section.name)}
              className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{section.icon}</span>
                <div className="text-left">
                  <h3 className="text-xl font-bold">{section.name}</h3>
                  <p className="text-sm text-gray-400">
                    Click to {isExpanded ? 'collapse' : 'expand'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy(section.output, section.name)
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isCopied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </button>

            {/* Content */}
            {isExpanded && (
              <div className="px-6 pb-6">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                    {section.output}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Full Raw Output Option */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <button
          onClick={() => toggleSection('raw')}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <h3 className="text-lg font-bold">Full Raw Output</h3>
          </div>
          {expandedSections.raw ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.raw && (
          <div className="mt-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10 max-h-96 overflow-y-auto">
              <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono">
                {results.crew_output}
              </pre>
            </div>
            <button
              onClick={() => handleCopy(results.crew_output, 'raw')}
              className="mt-3 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              {copiedSection === 'raw' ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Full Output
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentOutputCard
