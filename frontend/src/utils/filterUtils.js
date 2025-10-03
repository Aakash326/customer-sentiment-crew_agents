/**
 * Filter utilities for results filtering
 */

export const filterResults = (results, filters) => {
  if (!results || !results.crew_output) return results

  let filteredOutput = results.crew_output

  // Filter by keyword
  if (filters.keyword && filters.keyword.trim()) {
    const keywords = filters.keyword.toLowerCase().split(' ')
    const lines = filteredOutput.split('\n')
    const matchedLines = lines.filter(line =>
      keywords.some(keyword => line.toLowerCase().includes(keyword))
    )
    filteredOutput = matchedLines.join('\n')
  }

  // Filter by severity
  if (filters.severity !== 'all') {
    const severityMap = {
      'critical': /CRITICAL|URGENT|IMMEDIATE/i,
      'high': /HIGH|IMPORTANT/i,
      'medium': /MEDIUM|MODERATE/i,
      'low': /LOW|MINOR/i
    }

    const pattern = severityMap[filters.severity]
    if (pattern) {
      const lines = filteredOutput.split('\n')
      const matchedLines = lines.filter(line => pattern.test(line))
      filteredOutput = matchedLines.join('\n')
    }
  }

  // Filter by sentiment
  if (filters.sentiment !== 'all') {
    const sentimentMap = {
      'negative': /negative|anger|frustration|disappointed/i,
      'neutral': /neutral|mixed/i,
      'positive': /positive|satisfied|happy|pleased/i
    }

    const pattern = sentimentMap[filters.sentiment]
    if (pattern) {
      const lines = filteredOutput.split('\n')
      const matchedLines = lines.filter(line => pattern.test(line))
      filteredOutput = matchedLines.join('\n')
    }
  }

  return {
    ...results,
    crew_output: filteredOutput,
    filtered: true,
    activeFilters: filters
  }
}

export const sortResults = (items, sortBy) => {
  const sorted = [...items]

  switch (sortBy) {
    case 'priority':
      return sorted.sort((a, b) => {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })

    case 'priority-asc':
      return sorted.sort((a, b) => {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })

    case 'recent':
      return sorted.reverse()

    case 'mentions':
      return sorted.sort((a, b) => {
        const aMentions = parseInt(a.mentions || 0)
        const bMentions = parseInt(b.mentions || 0)
        return bMentions - aMentions
      })

    default:
      return sorted
  }
}
