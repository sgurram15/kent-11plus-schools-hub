# Deployment Guide - Kent 11+ Schools Hub

This guide walks you through deploying the app for **FREE** (or minimal cost).

**Total Cost: $0/month** (using free tiers)

---

## Overview

| Service | Provider | Cost | Purpose |
|---------|----------|------|---------|
| Database | MongoDB Atlas | FREE (M0) | Store school data |
| Backend | Railway | FREE (500 hrs/mo) | API + PDF serving |
| Frontend | Vercel | FREE | React app hosting |

---

## Step 1: Set Up MongoDB Atlas (FREE)

### 1.1 Create Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas/database)
2. Click "Try Free" and create an account

### 1.2 Create Cluster
1. Choose **FREE M0 Sandbox** (Shared)
2. Select cloud provider: **AWS**
3. Select region closest to your users (e.g., `eu-west-1` for UK)
4. Click "Create Cluster" (takes 1-3 minutes)

### 1.3 Set Up Database Access
1. Go to **Database Access** in sidebar
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Enter username (e.g., `kent11plus`)
5. Click "Autogenerate Secure Password" - **SAVE THIS PASSWORD!**
6. Set privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Set Up Network Access
1. Go to **Network Access** in sidebar
2. Click "Add IP Address"
3. Click **"Allow Access from Anywhere"** (for Railway/Render)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to **Database** in sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://kent11plus:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

**Save this connection string - you'll need it for Railway!**

---

## Step 2: Deploy Backend to Railway (FREE)

### 2.1 Push Code to GitHub
First, make sure your code is on GitHub:
```bash
# If not already done
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/kent-11plus-hub.git
git push -u origin main
```

### 2.2 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### 2.3 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select the `backend` folder as root directory

### 2.4 Configure Environment Variables
1. Go to your service → **Variables** tab
2. Add these variables:
   ```
   MONGO_URL = mongodb+srv://kent11plus:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME = kent_schools
   PORT = 8001
   ```

### 2.5 Configure Build Settings
Railway should auto-detect Python. If not:
1. Go to **Settings** tab
2. Set Root Directory: `/backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### 2.6 Deploy & Get URL
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Go to **Settings** → **Domains**
4. Click "Generate Domain"
5. Copy your URL (e.g., `https://kent-11plus-backend.up.railway.app`)

### 2.7 Test Backend
```bash
curl https://YOUR-RAILWAY-URL/api/health
# Should return: {"status":"healthy","service":"kent-11plus-api"}
```

### 2.8 Seed Database
```bash
curl -X POST https://YOUR-RAILWAY-URL/api/seed-schools
# Should return: {"message":"Seeded 31 schools successfully"}
```

---

## Step 3: Deploy Frontend to Vercel (FREE)

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Select your GitHub repository
3. Set **Root Directory** to `frontend`

### 3.3 Configure Environment Variables
1. Expand "Environment Variables"
2. Add:
   ```
   REACT_APP_BACKEND_URL = https://YOUR-RAILWAY-URL
   ```
   (Use the Railway URL from Step 2.6, **without trailing slash**)

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build (1-2 minutes)
3. Your app is live at `https://your-project.vercel.app`

### 3.5 Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

---

## Step 4: Verify Deployment

### Test Checklist
- [ ] Homepage loads
- [ ] Schools list displays 31 schools
- [ ] School detail pages work
- [ ] Compare feature works
- [ ] Practice Papers page loads
- [ ] PDF downloads work
- [ ] Key Dates page displays timeline

### Test URLs
```bash
# Frontend
https://your-app.vercel.app

# Backend API
https://your-backend.railway.app/api/health
https://your-backend.railway.app/api/schools
https://your-backend.railway.app/api/papers
```

---

## Free Tier Limits

### MongoDB Atlas M0 (FREE)
- 512 MB storage ✓ (you use ~1MB)
- Shared RAM
- 100 max connections

### Railway (FREE)
- 500 hours/month ✓
- 512 MB RAM
- 1 GB disk
- Sleeps after inactivity (wakes on request)

### Vercel (FREE - Hobby)
- 100 GB bandwidth/month ✓
- Unlimited deployments
- Automatic HTTPS
- Global CDN

**Your app fits comfortably in all free tiers!**

---

## Troubleshooting

### Backend not starting
```bash
# Check Railway logs
# Go to Railway dashboard → Deployments → View Logs
```

### Database connection error
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check MONGO_URL has correct password
- Ensure user has read/write permissions

### Frontend API errors
- Check REACT_APP_BACKEND_URL is correct
- Ensure no trailing slash in URL
- Verify CORS settings in backend

### PDF downloads not working
- Check `static/papers/` folder is included in deployment
- Verify files exist in Railway deployment

---

## Upgrading (When Needed)

If you outgrow free tiers:

| Service | Free Limit | Paid Option | Cost |
|---------|------------|-------------|------|
| MongoDB | 512 MB | M2 (2GB) | $9/mo |
| Railway | 500 hrs | Pro | $5/mo |
| Vercel | 100 GB | Pro | $20/mo |

---

## Quick Reference

### Your URLs (fill in after deployment)
```
Frontend: https://________________.vercel.app
Backend:  https://________________.railway.app
Database: MongoDB Atlas (kent_schools)
```

### Redeploy Commands
```bash
# Frontend (auto-deploys on git push)
git push origin main

# Backend (auto-deploys on git push)
git push origin main

# Manual redeploy
# Go to Railway/Vercel dashboard and click "Redeploy"
```

### Useful Links
- [Railway Dashboard](https://railway.app/dashboard)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)
