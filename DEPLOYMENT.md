# 🚀 Deployment Guide for Render

This guide will help you deploy both the backend and frontend to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **MongoDB Database**: 
   - Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
   - Or use Render's MongoDB service
3. **GitHub Repository**: Push your code to GitHub

---

## 📦 Step 1: Deploy Backend

### 1.1 Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

### 1.2 Deploy Backend Service

1. **Go to Render Dashboard** → Click "New +" → Select "Web Service"

2. **Connect Repository**:
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**:
   - **Name**: `accident-hotspot-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

4. **Set Environment Variables**:
   Click "Advanced" → Add these environment variables:
   ```
   NODE_ENV=production
   PORT=5050
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_here
   ```
   
   **Important**: 
   - Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas connection string
   - Replace `your_super_secret_jwt_key_here` with a strong random string (you can generate one online)

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://accident-hotspot-backend.onrender.com`)

### 1.3 Python Environment Setup

Since your backend uses Python for ML predictions, you need to ensure Python 3.9+ is available on Render.

**Option A: Use Render's Python Support**
- Render supports Python, but you may need to add a `requirements.txt` in the backend folder
- Create `backend/requirements.txt` with:
  ```
  scikit-learn==1.6.1
  pandas
  numpy
  joblib
  ```

**Option B: Use System Python**
- The current setup uses system Python, which should work on Render
- Make sure the Python script path is correct

---

## 🎨 Step 2: Deploy Frontend

### 2.1 Update Frontend API URL

Before deploying, update the frontend to use your production backend URL.

1. **Create `.env.production` file** in the `frontend` directory:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace `your-backend-url.onrender.com` with your actual backend URL from Step 1.

2. **Or update `frontend/src/api.js`** directly (temporary):
   ```javascript
   baseURL: import.meta.env.VITE_API_URL || "https://your-backend-url.onrender.com/api"
   ```

### 2.2 Deploy Frontend Service

1. **Go to Render Dashboard** → Click "New +" → Select "Static Site"

2. **Configure Static Site**:
   - **Name**: `accident-hotspot-frontend` (or your preferred name)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment**: `Node`

3. **Set Environment Variables** (if using .env):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**:
   - Click "Create Static Site"
   - Wait for build and deployment to complete
   - Your frontend will be live!

---

## 🔧 Step 3: Update CORS Settings

Make sure your backend allows requests from your frontend domain.

Update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.onrender.com'
  ],
  credentials: true
}));
```

Or for production, allow all origins (less secure but simpler):
```javascript
app.use(cors());
```

---

## 📝 Step 4: Environment Variables Summary

### Backend Environment Variables:
```
NODE_ENV=production
PORT=5050
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
```

### Frontend Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 🐛 Troubleshooting

### Backend Issues:

1. **MongoDB Connection Failed**:
   - Check your `MONGO_URI` is correct
   - Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) in Network Access

2. **Python Script Not Found**:
   - Check the path to Python scripts in `predictRoute.js`
   - Ensure Python 3.9+ is available
   - Consider using absolute paths

3. **Port Issues**:
   - Render automatically sets `PORT` environment variable
   - Your code should use `process.env.PORT || 5050`

### Frontend Issues:

1. **API Calls Failing**:
   - Check `VITE_API_URL` is set correctly
   - Verify backend URL is accessible
   - Check browser console for CORS errors

2. **Build Fails**:
   - Check Node version compatibility
   - Ensure all dependencies are in `package.json`

---

## 🔐 Security Notes

1. **Never commit** `.env` files to GitHub
2. **Use strong JWT_SECRET** - generate a random string
3. **Restrict MongoDB access** - only allow specific IPs if possible
4. **Use HTTPS** - Render provides this automatically

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## ✅ Quick Checklist

- [ ] MongoDB Atlas database created and connection string obtained
- [ ] Backend deployed on Render with all environment variables set
- [ ] Frontend API URL updated to point to backend
- [ ] Frontend deployed on Render
- [ ] CORS settings updated in backend
- [ ] Test the deployed application

---

**Need Help?** Check Render's logs in the dashboard for detailed error messages.

