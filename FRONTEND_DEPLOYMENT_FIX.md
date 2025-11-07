# 🔧 Frontend Deployment Fix - API URL Configuration

## Problem
The frontend is trying to connect to `localhost:5050` instead of your Render backend URL.

## ✅ Solution

### Step 1: Set Environment Variable in Render

1. **Go to Render Dashboard** → Your Frontend Static Site
2. **Click "Environment"** tab
3. **Add Environment Variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   
   **Important:** Replace `your-backend-url.onrender.com` with your actual backend URL from Render.

   Example:
   ```
   VITE_API_URL=https://accident-hotspot-backend.onrender.com/api
   ```

4. **Click "Save Changes"**

### Step 2: Rebuild and Redeploy

After adding the environment variable:

1. **Go to "Events" tab**
2. **Click "Manual Deploy"** → **"Deploy latest commit"**
3. **Wait for build to complete**

The build process will:
- Read the `VITE_API_URL` environment variable
- Inject it into the built JavaScript files
- Your app will now use the correct backend URL

### Step 3: Verify

After deployment:

1. **Open your frontend URL**
2. **Open browser console** (F12)
3. **Check the console** - you should see API calls going to your Render backend URL, not localhost

---

## 🔍 How It Works

Vite environment variables work like this:

1. **During build time**, Vite reads `VITE_*` environment variables
2. **Replaces** `import.meta.env.VITE_API_URL` in your code with the actual value
3. **Bakes the value** into the built JavaScript files

**Important:** 
- Environment variables must start with `VITE_` to be accessible in the frontend
- They are replaced at **build time**, not runtime
- You must **rebuild** after changing environment variables

---

## 🐛 Troubleshooting

### Issue: Still connecting to localhost

**Solution:**
1. Verify `VITE_API_URL` is set in Render environment variables
2. Make sure you redeployed after adding the variable
3. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console - look for the API base URL log message

### Issue: Environment variable not working

**Check:**
- Variable name is exactly `VITE_API_URL` (case-sensitive)
- Value doesn't have quotes around it
- Value ends with `/api` (not just the base URL)
- You've rebuilt after adding the variable

### Issue: CORS errors

**Solution:**
Make sure your backend CORS settings allow your frontend domain:
1. Go to backend service → Environment
2. Add/update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```
3. Redeploy backend

---

## 📋 Quick Checklist

- [ ] `VITE_API_URL` environment variable added in Render frontend service
- [ ] Value is: `https://your-backend-url.onrender.com/api`
- [ ] Frontend service redeployed after adding variable
- [ ] Backend `FRONTEND_URL` environment variable set
- [ ] Backend redeployed
- [ ] Browser cache cleared
- [ ] Tested registration/login

---

## ✅ Success Indicators

When it works:
- Browser console shows API calls to your Render backend URL
- Registration/login works
- No 404 or connection errors
- Network tab shows requests to `*.onrender.com`

---

## 💡 Alternative: Hardcode for Quick Fix

If you want a quick temporary fix (not recommended for production):

Update `frontend/src/api.js`:

```javascript
const API = axios.create({
  baseURL: "https://your-actual-backend-url.onrender.com/api"
});
```

Then rebuild and redeploy. But using environment variables is the better approach!

