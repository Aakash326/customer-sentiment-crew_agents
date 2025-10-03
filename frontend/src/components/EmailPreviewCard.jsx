import { useState } from 'react'
import { Mail, Copy, Download, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react'
import EmailPreviewModal from './EmailPreviewModal'

function EmailPreviewCard({ results }) {
  const [expandedEmails, setExpandedEmails] = useState({})
  const [copiedEmail, setCopiedEmail] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)

  if (!results?.crew_output) return null

  const toggleEmail = (index) => {
    setExpandedEmails(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleCopyEmail = (email, index) => {
    const text = `To: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`
    navigator.clipboard.writeText(text)
    setCopiedEmail(index)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  const handleDownloadEmail = (email, index) => {
    const text = `To: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `email_preview_${index + 1}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = (emails) => {
    const allText = emails.map((email, i) =>
      `EMAIL ${i + 1}\n${'='.repeat(50)}\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.body}\n\n`
    ).join('\n')

    const blob = new Blob([allText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all_email_previews.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Parse email previews from crew output
  const parseEmailPreviews = (crewOutput) => {
    const emails = []

    // Pattern 1: EMAIL N format with all fields
    const pattern1 = /EMAIL\s+(\d+):\s*\n\s*Department:\s*([^\n]+)\n\s*To:\s*([^\n]+)\n\s*Subject:\s*([^\n]+)\n\s*Priority:\s*([^\n]+)\n\s*Body:\s*([\s\S]*?)(?=\n\nEMAIL\s+\d+:|\n\n#{2,}|$)/gi

    let match
    while ((match = pattern1.exec(crewOutput)) !== null) {
      emails.push({
        priority: match[5].trim(),
        department: match[2].trim(),
        to: match[3].trim(),
        subject: match[4].trim(),
        body: match[6].trim()
      })
    }

    // Pattern 2: Alternative format without EMAIL N prefix
    if (emails.length === 0) {
      const pattern2 = /Department:\s*([^\n]+)\n\s*To:\s*([^\n]+)\n\s*Subject:\s*([^\n]+)\n\s*Priority:\s*([^\n]+)\n\s*Body:\s*([\s\S]*?)(?=\n\nDepartment:|\n\n#{2,}|$)/gi
      while ((match = pattern2.exec(crewOutput)) !== null) {
        emails.push({
          priority: match[4].trim(),
          department: match[1].trim(),
          to: match[2].trim(),
          subject: match[3].trim(),
          body: match[5].trim()
        })
      }
    }

    // Pattern 3: Look for email file content
    if (emails.length === 0) {
      const filePattern = /outputs\/emails_.*?\.txt[:\s]+([\s\S]*?)(?=outputs\/|$)/i
      const fileMatch = crewOutput.match(filePattern)
      if (fileMatch) {
        const emailContent = fileMatch[1]
        const emailSections = emailContent.split(/EMAIL\s+\d+:/i).filter(s => s.trim())

        for (const section of emailSections) {
          const deptMatch = section.match(/Department:\s*([^\n]+)/i)
          const toMatch = section.match(/To:\s*([^\n]+)/i)
          const subjectMatch = section.match(/Subject:\s*([^\n]+)/i)
          const priorityMatch = section.match(/Priority:\s*([^\n]+)/i)
          const bodyMatch = section.match(/Body:\s*([\s\S]+?)(?=\n\n|$)/i)

          if (toMatch && subjectMatch) {
            emails.push({
              priority: priorityMatch ? priorityMatch[1].trim() : 'MEDIUM',
              department: deptMatch ? deptMatch[1].trim() : 'General',
              to: toMatch[1].trim(),
              subject: subjectMatch[1].trim(),
              body: bodyMatch ? bodyMatch[1].trim() : ''
            })
          }
        }
      }
    }

    // Pattern 4: Generic Subject/Body pattern as fallback
    if (emails.length === 0) {
      const simplePattern = /Subject:\s*([^\n]+)[\s\S]*?(?:Dear|Hello|Hi|Team)([\s\S]*?)(?=Subject:|$)/gi
      while ((match = simplePattern.exec(crewOutput)) !== null) {
        const body = match[2].trim()
        if (body.length > 50) { // Only include if body has substantial content
          emails.push({
            priority: 'MEDIUM',
            department: 'General',
            to: 'Team',
            subject: match[1].trim(),
            body: body
          })
        }
      }
    }

    return emails
  }

  const emails = parseEmailPreviews(results.crew_output)

  const getPriorityColor = (priority) => {
    const p = priority.toUpperCase()
    if (p.includes('CRITICAL')) return 'red'
    if (p.includes('HIGH')) return 'orange'
    if (p.includes('MEDIUM')) return 'yellow'
    return 'blue'
  }

  const getPriorityClasses = (color) => {
    const classes = {
      red: 'border-red-500 bg-red-500/10',
      orange: 'border-orange-500 bg-orange-500/10',
      yellow: 'border-yellow-500 bg-yellow-500/10',
      blue: 'border-blue-500 bg-blue-500/10'
    }
    return classes[color] || classes.blue
  }

  const getPriorityBadgeClasses = (color) => {
    const classes = {
      red: 'bg-red-500 text-white',
      orange: 'bg-orange-500 text-white',
      yellow: 'bg-yellow-500 text-black',
      blue: 'bg-blue-500 text-white'
    }
    return classes[color] || classes.blue
  }

  if (emails.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold gradient-text mb-4">
          📧 Email Previews
        </h2>
        <p className="text-gray-400">
          No email previews were generated in this analysis.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">
          📧 Email Previews
        </h2>
        <button
          onClick={() => handleDownloadAll(emails)}
          className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download All
        </button>
      </div>

      {/* Important Notice */}
      <div className="glass rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-300">Email Previews Only</p>
            <p className="text-sm text-gray-300">
              These are PREVIEW emails generated by AI. No actual emails have been sent.
              Review and customize before sending to your team.
            </p>
          </div>
        </div>
      </div>

      {/* Email Count */}
      <div className="text-center">
        <p className="text-lg text-gray-300">
          <span className="font-bold text-primary">{emails.length}</span> email preview{emails.length !== 1 ? 's' : ''} generated
        </p>
      </div>

      {/* Email Cards */}
      <div className="space-y-4">
        {emails.map((email, index) => {
          const isExpanded = expandedEmails[index] !== false // Default expanded
          const isCopied = copiedEmail === index
          const priorityColor = getPriorityColor(email.priority)
          const wordCount = email.body.split(/\s+/).length
          const readTime = Math.max(1, Math.ceil(wordCount / 200))

          return (
            <div
              key={index}
              className={`glass rounded-xl border-2 overflow-hidden ${getPriorityClasses(priorityColor)}`}
            >
              {/* Email Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">
                        Email Preview {index + 1}/{emails.length}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {wordCount} words • {readTime} min read
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadgeClasses(priorityColor)}`}>
                    🚨 {email.priority}
                  </span>
                </div>

                {/* Email Metadata */}
                <div className="space-y-2 bg-slate-900/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">DEPARTMENT</p>
                      <p className="font-medium">📁 {email.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">TO</p>
                      <p className="font-medium">📧 {email.to}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">SUBJECT</p>
                    <p className="font-medium">📝 {email.subject}</p>
                  </div>
                </div>
              </div>

              {/* Email Body Toggle */}
              <button
                onClick={() => toggleEmail(index)}
                className="w-full px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-medium">Message Body</span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {/* Email Body Content */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {email.body}
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedEmail(email)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg text-sm flex items-center justify-center gap-2 transition-all font-semibold"
                    >
                      <Mail className="w-4 h-4" />
                      View Full Preview
                    </button>
                    <button
                      onClick={() => handleCopyEmail(email, index)}
                      className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Email
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadEmail(email, index)}
                      className="flex-1 px-4 py-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Email Preview Modal */}
      {selectedEmail && (
        <EmailPreviewModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </div>
  )
}

export default EmailPreviewCard
