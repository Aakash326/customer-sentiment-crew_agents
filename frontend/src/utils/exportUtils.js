/**
 * Utility functions for exporting data
 */

/**
 * Export data as JSON file
 * @param {object} data - Data to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportAsJSON = (data, filename) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  downloadBlob(blob, `${filename}.json`)
}

/**
 * Export data as text file
 * @param {string} text - Text content to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportAsText = (text, filename) => {
  const blob = new Blob([text], { type: 'text/plain' })
  downloadBlob(blob, `${filename}.txt`)
}

/**
 * Export data as CSV file
 * @param {array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportAsCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes in values
        const escaped = String(value).replace(/"/g, '""')
        return `"${escaped}"`
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  downloadBlob(blob, `${filename}.csv`)
}

/**
 * Export email previews as formatted text
 * @param {array} emails - Array of email objects
 * @param {string} filename - Name of the file (without extension)
 */
export const exportEmailPreviews = (emails, filename) => {
  const formattedEmails = emails.map((email, index) => {
    return [
      `${'='.repeat(70)}`,
      `EMAIL PREVIEW ${index + 1}/${emails.length}`,
      `${'='.repeat(70)}`,
      '',
      `PRIORITY: ${email.priority}`,
      `DEPARTMENT: ${email.department}`,
      `TO: ${email.to}`,
      `SUBJECT: ${email.subject}`,
      '',
      `MESSAGE:`,
      `${'-'.repeat(70)}`,
      email.body,
      '',
      ''
    ].join('\n')
  }).join('\n')

  const header = [
    `CUSTOMER SENTIMENT ALERT SYSTEM`,
    `Email Previews Export`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    `NOTE: These are AI-generated email PREVIEWS only.`,
    `Review and customize before sending to your team.`,
    '',
    ''
  ].join('\n')

  exportAsText(header + formattedEmails, filename)
}

/**
 * Export analysis report as formatted text
 * @param {object} results - Analysis results object
 * @param {string} filename - Name of the file (without extension)
 */
export const exportAnalysisReport = (results, filename) => {
  const report = [
    `${'='.repeat(70)}`,
    `CUSTOMER SENTIMENT ALERT SYSTEM - ANALYSIS REPORT`,
    `${'='.repeat(70)}`,
    '',
    `Company: ${results.company}`,
    `Workflow: ${results.workflow === 'fast' ? 'Fast (3 agents)' : 'Deep (5 agents)'}`,
    `Processing Time: ${results.processing_time}`,
    `Timestamp: ${results.execution_timestamp || new Date().toLocaleString()}`,
    '',
    `${'='.repeat(70)}`,
    `ANALYSIS RESULTS`,
    `${'='.repeat(70)}`,
    '',
    results.crew_output,
    '',
    `${'='.repeat(70)}`,
    `END OF REPORT`,
    `${'='.repeat(70)}`
  ].join('\n')

  exportAsText(report, filename)
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)

    // Fallback method
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
      return false
    }
  }
}

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Name of the file
 */
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Share data using Web Share API (if available)
 * @param {object} shareData - Data to share (title, text, url)
 * @returns {Promise<boolean>} Success status
 */
export const shareData = async (shareData) => {
  if (!navigator.share) {
    console.warn('Web Share API not supported')
    return false
  }

  try {
    await navigator.share(shareData)
    return true
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Share failed:', error)
    }
    return false
  }
}
