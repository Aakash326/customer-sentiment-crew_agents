/**
 * Utility functions for formatting data display
 */

/**
 * Format processing time from seconds to readable format
 * @param {string|number} time - Time in seconds or as string "X.X seconds"
 * @returns {string} Formatted time
 */
export const formatProcessingTime = (time) => {
  if (!time) return 'N/A'

  const seconds = typeof time === 'string'
    ? parseFloat(time.replace(/[^0-9.]/g, ''))
    : time

  if (isNaN(seconds)) return time.toString()

  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(0)}ms`
  } else if (seconds < 60) {
    return `${seconds.toFixed(1)}s`
  } else {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = (seconds % 60).toFixed(0)
    return `${minutes}m ${remainingSeconds}s`
  }
}

/**
 * Parse sentiment score from text (returns 0-100 scale for comparison mode)
 * @param {string} text - Text containing sentiment information
 * @returns {number} Sentiment score 0-100
 */
export const parseSentimentScore = (text) => {
  if (!text) return 50

  // Try to find sentiment score patterns
  const patterns = [
    /sentiment.*?(\d+)\/100/i,
    /score.*?(\d+)%/i,
    /(\d+)\/100.*?sentiment/i,
    /sentiment.*?(\d+)%/i
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return parseInt(match[1])
    }
  }

  // Default estimation based on keyword analysis
  const negative = (text.match(/negative|critical|urgent|crisis/gi) || []).length
  const positive = (text.match(/positive|good|excellent|satisfied/gi) || []).length
  const total = negative + positive

  if (total === 0) return 50 // Neutral default
  return Math.round((positive / total) * 100)
}

/**
 * Get sentiment label from score
 * @param {number} score - Sentiment score (-1 to 1)
 * @returns {object} Label and color
 */
export const getSentimentLabel = (score) => {
  if (score === null || score === undefined) {
    return { label: 'Unknown', color: 'gray', emoji: '❓' }
  }

  if (score < -0.5) {
    return { label: 'Very Negative', color: 'red', emoji: '😰' }
  } else if (score < -0.2) {
    return { label: 'Negative', color: 'orange', emoji: '😟' }
  } else if (score < 0.2) {
    return { label: 'Neutral', color: 'yellow', emoji: '😐' }
  } else if (score < 0.5) {
    return { label: 'Positive', color: 'blue', emoji: '🙂' }
  } else {
    return { label: 'Very Positive', color: 'green', emoji: '😊' }
  }
}

/**
 * Parse urgency score from text
 * @param {string} text - Text containing urgency information
 * @returns {number|null} Urgency score (typically 1-10)
 */
export const parseUrgencyScore = (text) => {
  if (!text) return null

  const match = text.match(/urgency[:\s]+(\d+)/i)
  return match ? parseInt(match[1]) : null
}

/**
 * Get urgency label from score
 * @param {number} score - Urgency score (1-10)
 * @returns {object} Label and color
 */
export const getUrgencyLabel = (score) => {
  if (score === null || score === undefined) {
    return { label: 'Unknown', color: 'gray' }
  }

  if (score >= 8) {
    return { label: 'Critical', color: 'red' }
  } else if (score >= 6) {
    return { label: 'High', color: 'orange' }
  } else if (score >= 4) {
    return { label: 'Medium', color: 'yellow' }
  } else {
    return { label: 'Low', color: 'blue' }
  }
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Format timestamp to readable date
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'

  try {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return timestamp
  }
}

/**
 * Parse mentions count from text
 * @param {string} text - Text containing mentions information
 * @returns {number|null} Number of mentions
 */
export const parseMentionsCount = (text) => {
  if (!text) return null

  const match = text.match(/(\d+)\s+(?:real\s+)?mentions?/i)
  return match ? parseInt(match[1]) : null
}

/**
 * Get color for priority level
 * @param {string} priority - Priority level (CRITICAL, HIGH, MEDIUM, LOW)
 * @returns {string} Tailwind color class
 */
export const getPriorityColor = (priority) => {
  const p = priority?.toUpperCase() || ''

  if (p.includes('CRITICAL')) return 'red'
  if (p.includes('HIGH')) return 'orange'
  if (p.includes('MEDIUM')) return 'yellow'
  if (p.includes('LOW')) return 'blue'
  return 'gray'
}

/**
 * Calculate read time for text
 * @param {string} text - Text content
 * @param {number} wordsPerMinute - Reading speed (default 200)
 * @returns {number} Estimated read time in minutes
 */
export const calculateReadTime = (text, wordsPerMinute = 200) => {
  if (!text) return 0

  const wordCount = text.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * Format large numbers with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A'
  return num.toLocaleString('en-US')
}

/**
 * Extract executive insights from crew output
 * @param {string} crewOutput - Full crew output text
 * @returns {string|null} Executive insights section or null
 */
export const extractExecutiveInsights = (crewOutput) => {
  if (!crewOutput) return null

  // Try to find the insights output file content
  const insightsMatch = crewOutput.match(/outputs\/insights_.*?\.txt[:\s]+(.*?)(?=outputs\/|$)/is)
  if (insightsMatch) {
    return insightsMatch[1].trim()
  }

  // Try to find Executive Insights section directly
  const directMatch = crewOutput.match(/(?:EXECUTIVE INSIGHTS|1\.\s*EXECUTIVE SUMMARY)(.*?)(?=\n\n#{2,}|\n\n[A-Z]{3,}|$)/is)
  if (directMatch) {
    return directMatch[0].trim()
  }

  // Try to find insights by looking for all 6 sections
  const fullInsightsMatch = crewOutput.match(/(1\.\s*EXECUTIVE SUMMARY.*?6\.\s*OPPORTUNITIES.*?)(?=\n\n|$)/is)
  if (fullInsightsMatch) {
    return fullInsightsMatch[1].trim()
  }

  return null
}
