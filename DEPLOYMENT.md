# MCA System Deployment Guide

## Overview

This guide covers deploying the MCA System using:
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Railway PostgreSQL
- **Monitoring**: Sentry

## Prerequisites

- Vercel account
- Railway account
- Sentry account (optional, for error tracking)
- Domain name (optional)

## 1. Database Deployment (Railway PostgreSQL)

### Step 1: Create PostgreSQL Database

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL service
railway add postgresql
```

### Step 2: Get Database URL

```bash
# Get connection string
railway variables

# Copy DATABASE_URL value
```

## 2. Backend Deployment (Railway)

### Step 1: Deploy API

```bash
# From project root
cd apps/api

# Link to Railway project
railway link

# Set environment variables
railway variables set OPENAI_API_KEY="your-key-here"
railway variables set NODE_ENV="production"
railway variables set SESSION_SECRET="your-secure-secret"

# Deploy
railway up
```

### Step 2: Run Database Migrations

```bash
# From apps/api directory
railway run pnpm prisma migrate deploy
```

### Step 3: Get API URL

```bash
# Get deployment URL
railway domain

# Your API will be at: https://your-project.railway.app
```

## 3. Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy Frontend

```bash
# From project root
cd apps/web

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: mca-system
# - Directory: ./
```

### Step 3: Set Environment Variables

```bash
# Set API URL
vercel env add VITE_API_URL production

# Enter your Railway API URL:
# https://your-project.railway.app
```

### Step 4: Deploy to Production

```bash
vercel --prod
```

## 4. Environment Variables

### Backend (Railway)

Required variables:

```env
# Database
DATABASE_URL=postgresql://...

# OpenAI (Required)
OPENAI_API_KEY=sk-...

# Optional AI APIs
CLAUDE_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Server
PORT=3001
NODE_ENV=production

# Security
SESSION_SECRET=your-secure-random-string-here
ALLOWED_ORIGINS=https://your-app.vercel.app

# Monitoring (Optional)
SENTRY_DSN=https://...@sentry.io/...
```

### Frontend (Vercel)

Required variables:

```env
VITE_API_URL=https://your-api.railway.app

# Monitoring (Optional)
VITE_SENTRY_DSN=https://...@sentry.io/...
```

## 5. Monitoring Setup (Optional)

### Step 1: Create Sentry Project

1. Go to https://sentry.io
2. Create new project
3. Select "Node.js" for backend
4. Select "React" for frontend
5. Copy DSN keys

### Step 2: Add Sentry to Backend

```bash
cd apps/api
pnpm add @sentry/node
```

Edit `src/server.ts`:

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Add after app initialization
app.use(Sentry.Handlers.requestHandler());

// Add before other error handlers
app.use(Sentry.Handlers.errorHandler());
```

### Step 3: Add Sentry to Frontend

```bash
cd apps/web
pnpm add @sentry/react
```

Edit `src/main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

## 6. Custom Domain (Optional)

### Vercel Custom Domain

```bash
# Add domain
vercel domains add your-domain.com

# Follow DNS configuration instructions
```

### Railway Custom Domain

```bash
# In Railway dashboard:
# Settings > Networking > Custom Domain
# Enter: api.your-domain.com

# Add CNAME record in your DNS:
# CNAME api your-project.railway.app
```

## 7. SSL/TLS

Both Vercel and Railway automatically provision SSL certificates via Let's Encrypt. No additional configuration needed.

## 8. Continuous Deployment

### Vercel (Frontend)

Automatically deploys when you push to Git:

```bash
# Connect to GitHub
vercel link

# Auto-deploy on push to main
```

### Railway (Backend)

```bash
# Connect to GitHub in Railway dashboard
# Settings > GitHub Repo > Connect

# Auto-deploy on push to main
```

## 9. Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] API health check returns 200: `https://your-api.railway.app/health`
- [ ] Frontend loads correctly
- [ ] API calls work from frontend
- [ ] Environment variables set correctly
- [ ] SSL certificates active
- [ ] Error monitoring configured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Database backups configured (Railway auto-backup)

## 10. Monitoring & Maintenance

### Check API Health

```bash
curl https://your-api.railway.app/health
```

### View Logs

```bash
# Railway
railway logs

# Vercel
vercel logs
```

### Database Backups

Railway automatically backs up PostgreSQL databases. To manually backup:

```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

## 11. Scaling

### Railway

- Vertical scaling: Adjust resources in Settings
- Horizontal scaling: Add replicas in Settings

### Vercel

- Automatically scales based on traffic
- No configuration needed

## 12. Cost Estimates

### Free Tier Limits

**Railway Free Trial:**
- $5 credit (one-time)
- Enough for ~500 hours of compute

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- 100 serverless function executions/day

**Production Costs (Estimated):**
- Railway (API + DB): $10-20/month
- Vercel (Frontend): Free - $20/month
- Total: ~$10-40/month depending on usage

## 13. Rollback

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Railway

```bash
# In Railway dashboard:
# Deployments > Click previous deployment > Redeploy
```

## 14. Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Enable rate limiting** in production
4. **Set up CORS** properly
5. **Use HTTPS** everywhere (automatic with Vercel/Railway)
6. **Regular dependency updates**
7. **Monitor error rates** with Sentry
8. **Database connection pooling** (Prisma handles this)

## 15. Troubleshooting

### API Returns 500

```bash
# Check Railway logs
railway logs

# Check environment variables
railway variables
```

### Frontend Can't Connect to API

1. Check CORS settings in backend
2. Verify VITE_API_URL in Vercel
3. Check API health endpoint

### Database Connection Issues

```bash
# Test database connection
railway run pnpm prisma db push

# Check DATABASE_URL format
```

## Support

For deployment issues:
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- MCA System: GitHub Issues

## Next Steps

After deployment:
1. Test all features end-to-end
2. Set up monitoring dashboards
3. Configure alerts
4. Plan backup strategy
5. Document runbooks for common issues
