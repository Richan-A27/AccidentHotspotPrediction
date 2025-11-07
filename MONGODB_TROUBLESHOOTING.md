# 🔧 MongoDB Connection Troubleshooting

## Issue: `connect ECONNREFUSED 127.0.0.1:27017`

This error means your app is trying to connect to localhost instead of MongoDB Atlas. This happens when the environment variable isn't being read correctly.

---

## ✅ Step-by-Step Fix

### Step 1: Verify Environment Variable in Render

1. **Go to Render Dashboard** → Your Backend Service
2. **Click "Environment"** tab
3. **Check if `MONGO_URI` exists**:
   - Look for a variable named exactly `MONGO_URI` (case-sensitive!)
   - Or `DATABASE_URL` or `MONGODB_URI`

### Step 2: Add/Update the Variable

If the variable doesn't exist or is wrong:

1. **Click "Add Environment Variable"**
2. **Key**: `MONGO_URI` (exactly this, all caps)
3. **Value**: Your MongoDB Atlas connection string

**Example MongoDB Atlas connection string format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
```

**Important:**
- Replace `username` with your MongoDB Atlas username
- Replace `password` with your actual password (URL-encode special characters)
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Replace `dbname` with your database name (e.g., `accidentdb`)

### Step 3: Get Your MongoDB Atlas Connection String

1. **Go to MongoDB Atlas** → Your Cluster
2. **Click "Connect"**
3. **Choose "Connect your application"**
4. **Copy the connection string**
5. **Replace `<password>`** with your actual database password
6. **Replace `<dbname>`** with your database name

**Example:**
```
Before: mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
After:  mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/accidentdb?retryWrites=true&w=majority
```

### Step 4: URL Encode Special Characters in Password

If your password has special characters, you need to URL-encode them:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

**Example:**
```
Password: My@Pass#123
Encoded:  My%40Pass%23123
```

### Step 5: Redeploy

After adding/updating the environment variable:

1. **Go to "Events" tab** in Render
2. **Click "Manual Deploy"** → **"Deploy latest commit"**
3. **Wait for deployment to complete**
4. **Check logs** - you should see:
   ```
   🔗 Attempting to connect to MongoDB: mongodb+srv://username:***@cluster...
   ✅ MongoDB Connected successfully!
   ```

---

## 🔍 Common Issues

### Issue 1: Variable Name Mismatch

**Problem:** Variable is named `MONGO_URL` instead of `MONGO_URI`

**Solution:** 
- Delete the wrong variable
- Add new variable with exact name: `MONGO_URI`

### Issue 2: Variable Not Saved

**Problem:** You typed the variable but didn't click "Save"

**Solution:**
- Make sure to click "Save Changes" after adding the variable
- Verify it appears in the environment variables list

### Issue 3: Wrong Connection String Format

**Problem:** Connection string is missing parts or has typos

**Solution:**
- Make sure it starts with `mongodb+srv://`
- Verify username and password are correct
- Check that cluster URL is correct
- Ensure database name is included

### Issue 4: MongoDB Atlas Network Access

**Problem:** Your IP isn't whitelisted in MongoDB Atlas

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Issue 5: Wrong Database User

**Problem:** Database user doesn't exist or password is wrong

**Solution:**
1. Go to MongoDB Atlas → Database Access
2. Verify your user exists
3. Reset password if needed
4. Update connection string with new password

---

## 🧪 Test Your Connection String

You can test your connection string locally before deploying:

1. **Create a test file** `test-connection.js`:
   ```javascript
   import mongoose from "mongoose";
   
   const mongoURI = "your_connection_string_here";
   
   mongoose.connect(mongoURI)
     .then(() => {
       console.log("✅ Connected!");
       process.exit(0);
     })
     .catch((err) => {
       console.error("❌ Error:", err.message);
       process.exit(1);
     });
   ```

2. **Run it**:
   ```bash
   node test-connection.js
   ```

---

## 📋 Checklist

Before redeploying, verify:

- [ ] Environment variable name is exactly `MONGO_URI` (all caps)
- [ ] Connection string starts with `mongodb+srv://`
- [ ] Password in connection string is URL-encoded if it has special characters
- [ ] Database name is included in the connection string
- [ ] MongoDB Atlas Network Access allows 0.0.0.0/0 (or Render's IP)
- [ ] Database user exists and password is correct
- [ ] Variable is saved in Render dashboard
- [ ] You've redeployed after adding the variable

---

## 🆘 Still Not Working?

1. **Check Render Logs:**
   - Go to your service → Logs tab
   - Look for the new log messages we added
   - They will show what environment variables are available

2. **Verify Variable is Set:**
   - The logs will show: `📋 Available env vars: [...]`
   - Make sure `MONGO_URI` appears in that list

3. **Try Alternative Variable Names:**
   - Add `DATABASE_URL` with the same value
   - The code checks for both `MONGO_URI`, `DATABASE_URL`, and `MONGODB_URI`

4. **Check MongoDB Atlas:**
   - Verify cluster is running (not paused)
   - Check database user permissions
   - Verify network access settings

---

## ✅ Success Indicators

When it works, you'll see in the logs:

```
🔗 Attempting to connect to MongoDB: mongodb+srv://username:***@cluster...
✅ MongoDB Connected successfully!
📊 Database: your_database_name
✅ Server running on port 10000
```

If you see these messages, your MongoDB connection is working! 🎉

