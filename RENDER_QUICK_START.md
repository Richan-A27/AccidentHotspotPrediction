# 🚀 Quick Start: Deploy to Render

## Prerequisites Checklist
- [ ] GitHub account
- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas account (free tier works)
- [ ] Render account (free tier available)

---

## Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster (choose AWS, closest region)
3. Create database user:
   - Database Access → Add New User
   - Username: `admin` (or your choice)
   - Password: Generate secure password (save it!)
4. Whitelist IP:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for testing
5. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/accidentdb?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend (10 minutes)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **New +** → **Web Service**
3. **Connect Repository**: Link your GitHub repo
4. **Configure**:
   ```
   Name: accident-hotspot-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```
5. **Environment Variables** (click "Advanced"):
   ```
   NODE_ENV = production
   PORT = 5050
   MONGO_URI = (paste your MongoDB connection string)
   JWT_SECRET = (generate random string, e.g., use: openssl rand -base64 32)
   ```
6. **Create Web Service**
7. **Wait for deployment** (5-10 minutes)
8. **Copy your backend URL**: `https://accident-hotspot-backend.onrender.com`

---

## Step 3: Deploy Frontend (10 minutes)

1. **Update API URL** in `frontend/src/api.js`:
   ```javascript
   baseURL: import.meta.env.VITE_API_URL || "https://your-backend-url.onrender.com/api"
   ```
   Replace `your-backend-url.onrender.com` with your actual backend URL.

2. **Go to Render Dashboard** → **New +** → **Static Site**

3. **Configure**:
   ```
   Name: accident-hotspot-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Environment Variables** (if using .env):
   ```
   VITE_API_URL = https://your-backend-url.onrender.com/api
   ```

5. **Create Static Site**

6. **Wait for deployment** (5-10 minutes)

---

## Step 4: Update CORS (2 minutes)

1. Go to your backend service on Render
2. **Environment** tab
3. Add new variable:
   ```
   FRONTEND_URL = https://your-frontend-url.onrender.com
   ```
4. **Manual Deploy** → **Deploy latest commit**

---

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Try making a prediction
4. Check backend logs if anything fails

---

## ⚠️ Important Notes

### Python Dependencies
Your backend uses Python for ML predictions. Render supports Python, but you may need to:

1. **Option A**: Install Python dependencies in build command:
   ```
   Build Command: npm install && pip3 install -r requirements.txt
   ```

2. **Option B**: Use system Python (may already work)

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid plan for always-on service

### MongoDB Atlas Free Tier
- 512MB storage
- Shared cluster
- Perfect for development/testing

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string is correct

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors

### Python script errors
- Check Python path in `predictRoute.js`
- Verify model files are in correct location
- Check Render logs for Python errors

---

## 📞 Need Help?

1. Check Render logs: Dashboard → Your Service → Logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Frontend API URL updated
- [ ] Frontend deployed on Render
- [ ] CORS updated with frontend URL
- [ ] Tested registration
- [ ] Tested prediction
- [ ] Everything works! 🎉

---

**Your app should now be live!** 🚀

