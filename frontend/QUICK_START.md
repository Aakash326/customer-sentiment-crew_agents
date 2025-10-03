# ⚡ Quick Start - 3 Minutes to Launch

## 🚀 Fastest Way to Get Running

### Step 1: Install Dependencies (30 seconds)

```bash
cd frontend
npm install
```

### Step 2: Start Backend (5 seconds)

Open **new terminal**, go to project root:

```bash
cd ..
python main.py
```

Keep this terminal open! ✅

### Step 3: Start Frontend (5 seconds)

In frontend terminal:

```bash
npm run dev
```

### Step 4: Open Browser (5 seconds)

Navigate to: **http://localhost:3000**

## ✅ Verification Checklist

- [ ] Backend terminal shows: `Uvicorn running on http://0.0.0.0:8000`
- [ ] Frontend shows: `Local: http://localhost:3000/`
- [ ] Dashboard loads in browser
- [ ] "Backend Online" green indicator visible

## 🎯 Test It Works

1. Type "Apple" in company input
2. Select "⚡ Fast Analysis"
3. Click "▶️ Start Analysis"
4. Wait 10-15 seconds
5. See beautiful results! 🎉

## 🐛 If Something Breaks

### Backend won't start?
```bash
pip install -r requirements.txt
python main.py
```

### Frontend won't install?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 in use?
Edit `vite.config.js`, change port to 3001

### Backend offline?
- Check terminal is still running `python main.py`
- Visit http://localhost:8000/health
- Should see JSON response

## 🎨 What You'll See

### Landing Page
- Beautiful gradient dashboard
- Company input with suggestions
- Fast vs Deep workflow cards
- Start button

### During Analysis
- Full-screen loading animation
- Real-time progress bar
- Agent status updates
- Stop button (red)

### Results Page
- Summary metrics (time, mentions, issues)
- Agent output cards (expandable)
- Email preview cards (formatted)
- Download/copy buttons

## 🎯 Two Workflows

### ⚡ Fast (10-15 seconds)
- Monitor Agent
- Sentiment Analyzer
- Response Coordinator
- **Use for:** Quick insights

### 🔍 Deep (25-35 seconds)
- All Fast agents +
- Priority Ranker
- Context Investigator
- **Use for:** Strategic decisions

## 💡 Pro Tips

1. **Try Fast first** to see it work quickly
2. **Use Stop button** to test abort functionality
3. **Expand agent outputs** to see detailed results
4. **Copy email previews** with one click
5. **Download reports** as JSON

## 📱 Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🎊 You're Ready!

That's it! You now have a fully functional sentiment analysis dashboard.

### Next Steps:
- Try different companies
- Test both workflows
- Export results
- Show it to judges 😎

---

**Need help?** Check `README.md` or `SETUP_GUIDE.md` for detailed docs.

**Happy analyzing!** 🚀
