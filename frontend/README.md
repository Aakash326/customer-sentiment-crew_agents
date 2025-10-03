# 🚨 Customer Sentiment Alert System - Frontend Dashboard

Beautiful, real-time React dashboard for the Customer Sentiment Alert System. This frontend provides an intuitive interface for analyzing company sentiment using AI-powered multi-agent workflows.

![Dashboard Preview](https://img.shields.io/badge/React-18.2-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-blue) ![Vite](https://img.shields.io/badge/Vite-4.4-purple)

## ✨ Features

### 🎨 Beautiful UI/UX
- Modern gradient-based design with glassmorphism effects
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Real-time progress indicators
- Dark theme optimized for long sessions

### 🚀 Core Functionality
- **Company Input**: Easy company selection with popular suggestions
- **Workflow Selection**: Choose between Fast (3 agents) or Deep (5 agents) analysis
- **Real-Time Progress**: Live agent execution tracking with estimated time
- **Stop Execution**: Abort analysis mid-process with red stop button
- **Agent Outputs**: Individual cards for each agent's results
- **Email Previews**: Beautifully formatted email cards with copy/download
- **Results Summary**: Comprehensive metrics dashboard
- **Export Options**: Download reports as JSON or text

### 🤖 Workflow Support
- **⚡ Fast Workflow** (10-15s): Monitor → Sentiment → Response Coordinator
- **🔍 Deep Workflow** (25-35s): Monitor → Sentiment → Priority Ranker → Context Investigator → Response Coordinator

## 📋 Prerequisites

- **Node.js** 16+ installed
- **npm** or **yarn** package manager
- **Backend server** running on `http://localhost:8000`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment (Optional)

Create a `.env` file if you need to change the API URL:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The dashboard will be available at: **http://localhost:3000**

### 4. Ensure Backend is Running

Before using the frontend, make sure the backend server is running:

```bash
# In the project root directory
python main.py
```

Backend should be running at `http://localhost:8000`

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage Guide

### Step 1: Enter Company Name
- Type any company name (e.g., "Apple", "Tesla", "Microsoft")
- Or click a popular company suggestion
- Minimum 2 characters required

### Step 2: Select Workflow
Choose between two analysis types:

**⚡ Fast Analysis (10-15 seconds)**
- Quick insights
- 3 agents
- Monitor + Sentiment + Response
- Best for immediate decisions

**🔍 Deep Analysis (25-35 seconds)**
- Comprehensive insights
- 5 agents
- Includes priority ranking and pattern investigation
- Best for strategic planning

### Step 3: Start Analysis
- Click "▶️ Start Analysis"
- Watch real-time progress
- See each agent complete
- Use "⏹️ STOP EXECUTION" to abort if needed

### Step 4: Review Results
- **Results Summary**: Key metrics and statistics
- **Agent Outputs**: Detailed findings from each agent
- **Email Previews**: Ready-to-send email templates
- Download reports or copy individual sections

## 🛠️ Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── CompanyInput.jsx           # Company name input
│   │   ├── WorkflowSelector.jsx       # Fast vs Deep selection
│   │   ├── ExecutionProgress.jsx      # Progress tracking
│   │   ├── LoadingAnimation.jsx       # Loading overlay
│   │   ├── AgentOutputCard.jsx        # Agent results display
│   │   ├── EmailPreviewCard.jsx       # Email preview cards
│   │   ├── ResultsSummary.jsx         # Results dashboard
│   │   └── ErrorDisplay.jsx           # Error handling
│   ├── services/
│   │   └── api.js                     # Backend API calls
│   ├── utils/
│   │   ├── formatters.js              # Data formatting
│   │   └── exportUtils.js             # Export functionality
│   ├── App.jsx                        # Main app component
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Components Overview

### CompanyInput
- Text input with validation
- Popular company suggestions
- Clear button

### WorkflowSelector
- Two-card layout (Fast vs Deep)
- Feature comparison
- Visual selection feedback

### ExecutionProgress
- Real-time progress bar
- Agent status list (completed/active/pending)
- Time elapsed and remaining
- **Stop execution button**

### LoadingAnimation
- Full-screen animated overlay
- Rotating progress ring
- Dynamic status messages
- Pulsing agent icons

### AgentOutputCard
- Collapsible agent sections
- Color-coded by agent type
- Copy functionality
- Raw output option

### EmailPreviewCard
- Priority color-coding
- Department categorization
- Expandable email bodies
- Copy/download individual emails
- Download all emails

### ResultsSummary
- Processing time metrics
- Mentions and critical issues count
- Data source indicator
- Platform search coverage
- Download full report

## 🔧 Configuration

### Tailwind Theme

Custom colors defined in `tailwind.config.js`:

```js
colors: {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  critical: '#dc2626',
}
```

### API Configuration

Configure backend URL in `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Or set directly in `src/services/api.js`:

```js
const API_BASE_URL = 'http://localhost:8000'
```

## 🐛 Troubleshooting

### Backend Connection Issues

**Problem**: "Backend server is not responding"

**Solutions**:
1. Ensure backend is running: `python main.py`
2. Check backend is on port 8000
3. Verify no firewall blocking localhost
4. Check browser console for CORS errors

### Port Already in Use

**Problem**: "Port 3000 already in use"

**Solution**: Change port in `vite.config.js`:

```js
server: {
  port: 3001, // Change to any available port
}
```

### Build Errors

**Problem**: "Module not found" or dependency errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Styling Issues

**Problem**: Tailwind classes not working

**Solution**:
1. Ensure `index.css` imports Tailwind directives
2. Check `tailwind.config.js` content paths
3. Restart dev server: `npm run dev`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Notes

- Frontend connects to localhost backend only
- No external API calls from frontend
- All data stays on your local machine
- Email previews are NOT sent automatically

## 📊 Performance

- **First Load**: ~1-2 seconds
- **Fast Analysis**: 10-15 seconds
- **Deep Analysis**: 25-35 seconds
- **Build Size**: ~200KB (gzipped)

## 🤝 Contributing

This is a hackathon project. If you find issues:

1. Check troubleshooting section
2. Review browser console for errors
3. Verify backend is running correctly

## 📄 License

Part of the Customer Sentiment Alert System project.

## 🎯 Key Features Checklist

✅ Beautiful gradient-based UI
✅ Real-time progress tracking
✅ Stop execution functionality
✅ Individual agent output display
✅ Email preview cards with formatting
✅ Copy/download functionality
✅ Results summary dashboard
✅ Error handling with suggestions
✅ Responsive design
✅ Loading animations
✅ Backend health checking

## 💡 Tips for Best Experience

1. **Use Chrome**: Best performance and compatibility
2. **Full Screen**: Dashboard looks best at 1920x1080+
3. **Fast Workflow First**: Try fast analysis before deep
4. **Watch Progress**: Don't navigate away during analysis
5. **Review Outputs**: Expand each agent section for details
6. **Download Results**: Save reports for later review

---

**Built with React, Tailwind CSS, and ❤️ for the AI Agents Hackathon**

🚀 Happy Analyzing!
