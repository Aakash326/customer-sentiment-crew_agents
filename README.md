# Customer Sentiment Alert System

🚨 **AI-Powered Real-Time Crisis Prevention Tool**

An intelligent multi-agent system that analyzes **REAL internet data** for any company to prevent PR crises before they go viral. Built with CrewAI, OpenAI GPT-4o-mini, and Tavily Search API.

## 🔥 Key Innovation: REAL Internet Search

Unlike other sentiment analysis tools that use mock data, this system:
- ✅ Searches **actual Twitter/X, Reddit, news sites** using Tavily API
- ✅ Works for **ANY company** (Apple, Tesla, Microsoft, etc.)
- ✅ Analyzes **real mentions from last 24-48 hours**
- ✅ Shows **email previews** (doesn't actually send emails)
- ✅ Provides **actionable insights** in 10-35 seconds

## 🏗️ Architecture

### Multi-Agent System (5 Specialized AI Agents)

1. **Monitor Agent** - Searches REAL internet for brand mentions via Tavily
2. **Sentiment Analyzer** - Evaluates emotional tone and urgency  
3. **Priority Ranker** - Ranks issues by business impact (0-100 scoring)
4. **Context Investigator** - Identifies patterns and root causes
5. **Response Coordinator** - Creates email previews for different departments

### Two Workflow Modes

**🚀 FAST MODE (3 Agents)**
- **Time:** 10-15 seconds
- **Agents:** Monitor → Sentiment Analyzer → Response Coordinator
- **Use Case:** Quick analysis for immediate response

**🔍 DEEP MODE (5 Agents)**  
- **Time:** 25-35 seconds
- **Agents:** All 5 agents in comprehensive pipeline
- **Use Case:** Strategic analysis with pattern investigation

## 🎯 How It Works

```
1. User Input: "Apple" (or any company)
   ↓
2. Monitor Agent: Searches Tavily for real mentions
   ↓
3. Sentiment Analysis: Evaluates actual Twitter/Reddit posts
   ↓
4. Priority Ranking: Scores by business impact
   ↓
5. Email Previews: Shows what WOULD be sent

📧 EMAIL PREVIEW 1/3
━━━━━━━━━━━━━━━━━━━━━
🚨 PRIORITY: CRITICAL
📧 TO: engineering@apple.com
📝 SUBJECT: iOS Crash Pattern Detected
[Full email preview shown]

📧 EMAIL PREVIEW 2/3  
━━━━━━━━━━━━━━━━━━━━━
⚠️ PRIORITY: HIGH
📧 TO: pr@apple.com
📝 SUBJECT: Viral Complaint Trending
[Full email preview shown]
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository>
cd "Customer Sentiment Alert System"
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy template and add your API keys
cp .env.example .env

# Edit .env with your keys:
OPENAI_API_KEY=sk-your-openai-key-here
TAVILY_API_KEY=tvly-your-tavily-key-here
```

### 4. Start the Server

```bash
python main.py
```

Server runs on: `http://localhost:8000`

## 🔑 API Keys Required

### OpenAI API Key (Required)
- Get from: https://platform.openai.com/api-keys
- Used for: GPT-4o-mini agents

### Tavily API Key (Required for Real Search)
- Get from: https://tavily.com
- Used for: Real internet search
- **Without this:** System uses fallback mock data

## 📡 API Endpoints

### Fast Analysis
```bash
curl -X POST http://localhost:8000/analyze/fast \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Apple"}'
```

### Deep Analysis  
```bash
curl -X POST http://localhost:8000/analyze/deep \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Tesla"}'
```

### Health Check
```bash
curl http://localhost:8000/health
```

### Supported Companies
```bash
curl http://localhost:8000/supported-companies
```

## 📊 Example Response

```json
{
  "status": "success",
  "workflow": "fast",
  "company": "Apple", 
  "agents_used": 3,
  "processing_time": "12.3 seconds",
  "data_source": "tavily_real_internet_search",
  "search_platforms": ["Twitter/X", "Reddit", "News Sites"],
  "analysis": {
    "mentions_analyzed": "15 real mentions found",
    "critical_issues_identified": 3,
    "viral_potential_assessed": "2 High, 1 Medium risk"
  },
  "email_previews": {
    "note": "Email previews generated - no actual emails sent",
    "departments": ["Engineering", "PR", "Support"], 
    "count": 3
  },
  "crew_output": "[Detailed analysis and email previews]"
}
```

## 🧪 Demo Companies to Try

- **Apple** - iOS, MacOS, hardware issues
- **Tesla** - Vehicle, charging, Autopilot feedback  
- **Microsoft** - Windows, Office, Azure complaints
- **Google** - Search, Android, Cloud services
- **Amazon** - Prime, shipping, AWS issues
- **Meta** - Facebook, Instagram, WhatsApp problems
- **Netflix** - Streaming, content, UI complaints

## 🛠️ Technology Stack

- **Framework:** CrewAI 0.40+ (Multi-agent orchestration)
- **LLM:** OpenAI GPT-4o-mini (Fast and efficient)
- **Search:** Tavily API (Real internet data)
- **API:** FastAPI (REST endpoints)
- **Language:** Python 3.9+

## 📁 Project Structure

```
backend/
├── agents/                    # AI agent definitions
│   ├── monitor_agent.py      # Real internet search
│   ├── sentiment_analyzer.py # Emotion analysis
│   ├── priority_ranker.py    # Business impact scoring
│   ├── context_investigator.py # Pattern analysis
│   └── response_coordinator.py # Email previews
├── tools/                     # Custom CrewAI tools
│   ├── tavily_search.py      # Real internet search
│   └── email_preview.py      # Email formatting
├── workflows/                 # Workflow orchestration
│   ├── fast_workflow.py      # 3-agent pipeline
│   └── deep_workflow.py      # 5-agent pipeline
├── data/                      # Fallback data
│   └── mock_data.json        # Used when Tavily fails
├── crew_setup.py             # Main orchestrator
├── main.py                   # FastAPI server
├── config.py                 # Configuration
└── requirements.txt          # Dependencies
```

## 🎯 Key Features

### ✅ Real Internet Data
- Uses Tavily API to search actual social media
- Analyzes current mentions, not simulated data
- Searches Twitter, Reddit, news sites, forums

### ✅ Any Company Support  
- Works for ANY brand with online presence
- No pre-configuration needed
- Real-time search for fresh data

### ✅ Email Previews (No Sending)
- Shows what emails WOULD be sent
- No Gmail/SMTP setup required
- Perfect for demos and testing

### ✅ Multi-Agent Intelligence
- 5 specialized AI agents
- Each agent has specific expertise
- Collaborative analysis pipeline

### ✅ Business Impact Scoring
- 0-100 priority scoring system
- Considers viral potential, user influence
- Helps prioritize response efforts

## 🚨 Important Notes

### Email Previews Only
- **Does NOT send actual emails**
- Only generates formatted previews
- Shows what WOULD be sent to teams

### Real vs Mock Data
- **Primary:** Real internet search via Tavily
- **Fallback:** Mock data if Tavily unavailable
- Check logs to see which data source is used

### API Rate Limits
- Tavily: 1000 searches/month free tier
- OpenAI: Pay per token usage
- Consider upgrading for production use

## 🔍 Troubleshooting

### "Tavily client not available"
- Check `TAVILY_API_KEY` in `.env`
- Verify API key is active
- System will use fallback mock data

### "OpenAI API error"  
- Check `OPENAI_API_KEY` in `.env`
- Verify account has credits
- Check API key permissions

### Slow performance
- Fast mode target: 10-15 seconds
- Deep mode target: 25-35 seconds
- Check internet connection and API status

## 📈 Performance Metrics

| Mode | Agents | Target Time | Use Case |
|------|--------|-------------|----------|
| Fast | 3 | 10-15 sec | Immediate response |
| Deep | 5 | 25-35 sec | Strategic analysis |

## 🤝 Contributing

This is a hackathon project demonstrating real-time sentiment analysis with actual internet data. The focus is on:

1. **Real Data:** Using Tavily for actual internet search
2. **Email Previews:** Showing response content without sending
3. **Multi-Agent AI:** Specialized agents for different tasks
4. **Any Company:** Works for any brand, not just predefined ones

## 📄 License

This project is for hackathon/educational purposes.

---

**🔥 Built for hackathons to demonstrate real-time AI crisis prevention using actual internet data!**