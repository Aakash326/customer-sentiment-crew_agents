# 🏗️ Frontend Architecture

## Component Hierarchy

```
App.jsx (Main Container)
├── Header
│   ├── Title
│   └── Backend Status Indicator
│
├── ErrorDisplay (conditional)
│   ├── Error Message
│   ├── Suggestions
│   └── Retry Button
│
├── Landing View (pre-analysis)
│   ├── CompanyInput
│   │   ├── Input Field
│   │   ├── Clear Button
│   │   └── Popular Suggestions
│   │
│   ├── WorkflowSelector
│   │   ├── Fast Workflow Card
│   │   └── Deep Workflow Card
│   │
│   └── Start Button
│
├── Execution View (during analysis)
│   ├── LoadingAnimation (overlay)
│   │   ├── Progress Ring
│   │   ├── Company Name
│   │   ├── Progress Percentage
│   │   └── Agent Icons
│   │
│   └── ExecutionProgress
│       ├── Progress Bar
│       ├── Time Indicators
│       ├── Agent Status List
│       └── Stop Button
│
└── Results View (post-analysis)
    ├── ResultsSummary
    │   ├── Success Banner
    │   ├── Metrics Grid
    │   │   ├── Processing Time
    │   │   ├── Mentions Found
    │   │   ├── Critical Issues
    │   │   └── Agents Used
    │   ├── Details Section
    │   └── Download Report Button
    │
    ├── AgentOutputCard
    │   ├── Agent Sections (collapsible)
    │   │   ├── Monitor Agent
    │   │   ├── Sentiment Analyzer
    │   │   ├── Priority Ranker (deep only)
    │   │   ├── Context Investigator (deep only)
    │   │   └── Response Coordinator
    │   └── Raw Output Section
    │
    └── EmailPreviewCard
        ├── Header (count, download all)
        ├── Notice Banner
        └── Email Cards
            ├── Priority Badge
            ├── Metadata (dept, to, subject)
            ├── Expandable Body
            └── Copy/Download Buttons
```

## Data Flow

```
┌─────────────┐
│   User      │
│   Input     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│    App.jsx      │
│  (State Mgmt)   │
└────────┬────────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌──────────────┐      ┌──────────────┐
│   API Layer  │      │  Components  │
│  (api.js)    │      │              │
└──────┬───────┘      └──────────────┘
       │
       ▼
┌─────────────────┐
│  FastAPI        │
│  Backend        │
│  (port 8000)    │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  CrewAI         │
│  Agents         │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  Results        │
│  (crew_output)  │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  Parsing &      │
│  Display        │
└─────────────────┘
```

## State Management

### App-Level State
```javascript
App.jsx manages:
├── companyName: string
├── workflow: 'fast' | 'deep'
├── isAnalyzing: boolean
├── progress: number (0-100)
├── currentAgent: string | null
├── completedAgents: string[]
├── results: object | null
├── error: string | null
└── backendStatus: 'checking' | 'online' | 'offline'
```

### Component-Level State
```javascript
CompanyInput:
└── (none - controlled by parent)

WorkflowSelector:
└── (none - controlled by parent)

ExecutionProgress:
└── elapsedTime: number

LoadingAnimation:
└── (none - uses props only)

AgentOutputCard:
├── expandedSections: object
└── copiedSection: string | null

EmailPreviewCard:
├── expandedEmails: object
└── copiedEmail: number | null

ResultsSummary:
└── (none - uses props only)

ErrorDisplay:
└── (none - uses props only)
```

## Service Layer

```
services/api.js
├── checkBackendHealth()
│   └── GET /health
│
├── startFastAnalysis(companyName, signal)
│   └── POST /analyze/fast
│
├── startDeepAnalysis(companyName, signal)
│   └── POST /analyze/deep
│
├── getSupportedCompanies()
│   └── GET /supported-companies
│
└── getSystemInfo()
    └── GET /
```

## Utility Layer

```
utils/formatters.js
├── formatProcessingTime()
├── parseSentimentScore()
├── getSentimentLabel()
├── parseUrgencyScore()
├── getUrgencyLabel()
├── truncateText()
├── formatTimestamp()
├── parseMentionsCount()
├── getPriorityColor()
├── calculateReadTime()
└── formatNumber()

utils/exportUtils.js
├── exportAsJSON()
├── exportAsText()
├── exportAsCSV()
├── exportEmailPreviews()
├── exportAnalysisReport()
├── copyToClipboard()
└── shareData()
```

## Styling Architecture

```
Global Styles (index.css)
├── @tailwind directives
├── .glass (glassmorphism)
├── .gradient-text
├── .gradient-bg
└── Custom scrollbar

Tailwind Config
├── Custom Colors
│   ├── primary: #667eea
│   ├── secondary: #764ba2
│   ├── success: #10b981
│   ├── warning: #f59e0b
│   ├── danger: #ef4444
│   └── critical: #dc2626
│
└── Custom Animations
    ├── pulse-slow
    ├── spin-slow
    └── gradient

Component Styles
└── Inline Tailwind classes
```

## Build Configuration

```
Vite Configuration
├── React Plugin
├── Dev Server (port 3000)
└── Proxy to Backend (/api → :8000)

Tailwind Configuration
├── Content Paths
├── Theme Extensions
└── Plugins

PostCSS Configuration
├── Tailwind Processing
└── Autoprefixer
```

## Request Flow

### Starting Analysis

```
1. User clicks "Start Analysis"
   ↓
2. App.jsx validates input
   ↓
3. Creates AbortController
   ↓
4. Sets isAnalyzing = true
   ↓
5. Starts progress simulation
   ↓
6. Calls api.startFastAnalysis() or startDeepAnalysis()
   ↓
7. Fetch request to backend with abort signal
   ↓
8. Backend processes (10-30s)
   ↓
9. Progress updates via simulation
   ↓
10. Results received
   ↓
11. Sets results state
   ↓
12. Component parses and displays
```

### Stopping Analysis

```
1. User clicks "Stop Execution"
   ↓
2. App.jsx calls handleStopAnalysis()
   ↓
3. Aborts fetch request via AbortController
   ↓
4. Catch block detects AbortError
   ↓
5. Sets error message
   ↓
6. Resets state
   ↓
7. Shows error display with partial results (if any)
```

## Error Handling Flow

```
Error Occurs
   ↓
Caught in try/catch
   ↓
Error analyzed for type:
   ├── AbortError → "Analysis stopped"
   ├── Network Error → "Backend not responding"
   ├── HTTP 500 → "Analysis failed"
   └── Other → Generic message
   ↓
Error set in state
   ↓
ErrorDisplay component shown
   ↓
Context-aware suggestions displayed
   ↓
User can retry or dismiss
```

## Performance Optimizations

### Current
- Component-level state (prevents unnecessary re-renders)
- Conditional rendering (only active view shown)
- Efficient parsing (regex patterns)
- Debounced effects ready

### Future Opportunities
- React.memo() for expensive components
- useMemo() for parsed data
- useCallback() for event handlers
- Code splitting by route
- Lazy loading for heavy components
- Virtual scrolling for long lists

## Security Considerations

### Implemented
- Input validation (min length)
- Fetch with abort capability
- No sensitive data in state
- Local-only operation

### Best Practices
- HTTPS in production
- Content Security Policy headers
- Environment variable usage
- Sanitized user input

## Scalability Considerations

### Current Architecture Supports
- Adding new components easily
- Extending utility functions
- Multiple workflow types
- New export formats

### Easy to Add
- User authentication
- Result history
- Multiple company comparison
- Custom agent selection
- Advanced filtering
- Real-time streaming (SSE)

## Testing Strategy (Future)

```
Unit Tests
├── Components
│   ├── Render tests
│   ├── Interaction tests
│   └── State updates
│
├── Utilities
│   ├── Formatters
│   └── Exporters
│
└── Services
    └── API calls (mocked)

Integration Tests
├── User flows
├── API integration
└── Error scenarios

E2E Tests
├── Full analysis flow
├── Export functionality
└── Stop execution
```

## Deployment Architecture

```
Development
├── Vite Dev Server (port 3000)
└── Hot Module Replacement

Production
├── Static Build (dist/)
├── CDN Distribution
└── Backend API (separate)

Options
├── Vercel (recommended)
├── Netlify
├── AWS S3 + CloudFront
└── Docker Container
```

## Browser Compatibility

```
Modern Browsers (2023+)
├── ES6+ support
├── Fetch API
├── AbortController
├── Clipboard API
├── localStorage
└── CSS Grid/Flexbox

Polyfills Needed (older browsers)
├── None for modern browsers
└── Add as needed for legacy support
```

---

**This architecture provides:**
- ✅ Clear component hierarchy
- ✅ Predictable data flow
- ✅ Maintainable code structure
- ✅ Scalable foundation
- ✅ Easy debugging
- ✅ Future-proof design
