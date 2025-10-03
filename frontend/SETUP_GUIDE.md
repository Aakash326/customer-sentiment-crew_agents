# 🚀 Complete Setup Guide - Customer Sentiment Alert System Frontend

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- ✅ **Node.js 16+** installed ([Download](https://nodejs.org/))
- ✅ **Python 3.9+** installed (for backend)
- ✅ **Backend running** on port 8000
- ✅ **Terminal/Command Prompt** access

## 🎯 Step-by-Step Setup

### Step 1: Navigate to Frontend Directory

```bash
cd "Customer Sentiment Alert System/frontend"
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 200+ packages in 30s
```

If you see any peer dependency warnings, they're usually safe to ignore.

### Step 3: Create Environment File (Optional)

```bash
cp .env.example .env
```

The default configuration connects to `http://localhost:8000` which should work if your backend is running locally.

### Step 4: Start Backend Server

Open a **new terminal window** and run:

```bash
# From project root directory
cd "Customer Sentiment Alert System"
python main.py
```

**Expected output:**
```
🚀 Starting Customer Sentiment Alert System on 0.0.0.0:8000
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Keep this terminal window open - don't close it!

### Step 5: Start Frontend Development Server

In your **frontend terminal**, run:

```bash
npm run dev
```

**Expected output:**
```
VITE v4.4.5  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 6: Open Dashboard

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the beautiful gradient dashboard with:
- 🚨 Customer Sentiment Alert System header
- ✅ "Backend Online" green indicator
- Company input field
- Workflow selection cards

## ✅ Verify Everything Works

### Test 1: Backend Health Check

1. Look for "Backend Online" indicator in the dashboard header
2. If you see "Backend Offline" or "Checking backend...":
   - Check that `python main.py` is still running
   - Try accessing http://localhost:8000/health in your browser
   - You should see JSON health status

### Test 2: Run Fast Analysis

1. Enter "Apple" in the company input
2. Select "⚡ Fast Analysis"
3. Click "▶️ Start Analysis"
4. You should see:
   - Loading animation overlay
   - Progress bar advancing
   - Agent status updates
   - Results after 10-15 seconds

### Test 3: Stop Execution

1. Start another analysis
2. Click "⏹️ STOP EXECUTION" button
3. Analysis should abort
4. You should see an error message about stopped analysis

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module" errors

**Problem**: Missing dependencies

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: "Port 3000 already in use"

**Problem**: Another app is using port 3000

**Solution 1** - Kill the process:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution 2** - Use different port in `vite.config.js`:
```js
server: {
  port: 3001,
}
```

### Issue 3: "Backend not responding"

**Problem**: Backend server not running or wrong port

**Checklist**:
1. ✅ Is `python main.py` running in another terminal?
2. ✅ Can you access http://localhost:8000/health?
3. ✅ Check `.env` file has correct `VITE_API_URL`
4. ✅ Try restarting backend: `python main.py`

### Issue 4: Tailwind styles not working

**Problem**: CSS not being processed

**Solution**:
```bash
# Restart dev server
npm run dev
```

Check `index.css` has:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue 5: CORS errors in browser console

**Problem**: Backend blocking frontend requests

**Solution**:
Backend should already have CORS configured, but if you see errors:

1. Check `config.py` in backend has:
```python
CORS_ORIGINS = ["http://localhost:3000", "*"]
```

2. Restart backend after changes

## 📦 Production Build

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Test Production Build Locally

```bash
npm run preview
```

Visit http://localhost:4173

### Deploy Production Build

Upload contents of `dist/` directory to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

**Important**: Update `VITE_API_URL` in `.env` to point to your production backend URL before building!

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: '#667eea',    // Change to your color
  secondary: '#764ba2',   // Change to your color
  // ... more colors
}
```

### Change Backend URL

Edit `.env`:

```env
VITE_API_URL=https://your-backend-url.com
```

Or edit `src/services/api.js` directly:

```js
const API_BASE_URL = 'https://your-backend-url.com'
```

### Add New Company Suggestions

Edit `src/components/CompanyInput.jsx`:

```js
const POPULAR_COMPANIES = [
  'Apple', 'Google', 'Your Company', // Add here
]
```

## 📱 Development Tips

### Hot Module Replacement (HMR)

Vite supports HMR - changes are reflected instantly:
- Edit any `.jsx` file
- Save the file
- Browser updates automatically (no refresh needed)

### Browser DevTools

- **F12** or **Cmd+Option+I** (Mac) / **Ctrl+Shift+I** (Windows)
- Check **Console** tab for errors
- Check **Network** tab for API calls
- Check **Elements** tab for styling issues

### Code Formatting

Install Prettier extension in VS Code for auto-formatting:

```bash
npm install -D prettier
```

Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## 🔥 Performance Optimization

### Development Mode

Current setup is optimized for development:
- Fast refresh
- Source maps
- Detailed error messages

### Production Mode

`npm run build` automatically:
- Minifies JavaScript
- Removes console.logs
- Optimizes assets
- Tree-shakes unused code
- Generates compressed files

## 📊 Bundle Analysis

Check bundle size:

```bash
npm run build
```

Look for output like:
```
dist/assets/index-abc123.js   150.00 kB
dist/assets/index-def456.css   20.00 kB
```

## 🎯 Next Steps

1. ✅ Complete setup above
2. 🧪 Run test analysis with "Apple"
3. 🎨 Customize colors if desired
4. 📱 Test on mobile device (access via network IP)
5. 🚀 Build for production when ready

## 💡 Pro Tips

1. **Use Chrome** for best dev experience
2. **Keep backend terminal visible** to see API logs
3. **Use React DevTools** browser extension
4. **Enable Tailwind IntelliSense** in VS Code
5. **Test both Fast and Deep workflows** to see differences

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)

## 🎉 Success!

If you can:
- ✅ See the dashboard at http://localhost:3000
- ✅ See "Backend Online" indicator
- ✅ Run an analysis successfully
- ✅ See agent outputs and email previews

**Congratulations! Your frontend is fully set up!** 🎊

---

**Questions or Issues?**

Check the main README.md or review the troubleshooting section above.

Happy coding! 🚀
