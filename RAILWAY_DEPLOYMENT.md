# Railway Deployment Guide

This guide covers deploying the Learn Erlang tutorial site to Railway.

## Prerequisites

1. Railway account at [railway.app](https://railway.app)
2. Railway CLI installed: `npm install -g @railway/cli`
3. Project repository connected to Railway

## Configuration Files

The following files have been created for Railway deployment:

### Core Configuration
- `railway.json` - Railway service configuration
- `nixpacks.toml` - Nixpacks build configuration  
- `.railwayignore` - Files to exclude from deployment

### Supporting Files
- `deploy.sh` - Deployment script (executable)
- `.env.example` - Environment variables template
- `src/pages/health.json.ts` - Health check endpoint

## Deployment Steps

### 1. Initial Setup
```bash
# Login to Railway
railway login

# Initialize project (if not already connected)
railway init

# Link to existing project
railway link
```

### 2. Environment Variables
Set these in Railway dashboard or via CLI:
```bash
railway variables set NODE_ENV=production
railway variables set SITE_URL=https://learnerlang.com
```

### 3. Deploy
```bash
# Deploy to Railway
railway up

# Or deploy specific environment
railway up --environment production
```

### 4. Custom Domain
1. Go to Railway dashboard
2. Select your service
3. Navigate to Settings → Domains
4. Add custom domain: `learnerlang.com`
5. Configure DNS records as shown

## Build Process

Railway will automatically:
1. Install dependencies with `npm ci`
2. Run type checking and build with `npm run build`
3. Start the preview server with `npm start`

## Health Check

The deployment includes a health check endpoint at `/health.json` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "learn-erlang-site"
}
```

## Monitoring

- Railway provides built-in monitoring and logs
- Access logs via: `railway logs`
- Monitor deployment status in Railway dashboard

## Troubleshooting

### Build Failures
- Check Railway logs: `railway logs`
- Verify Node.js version compatibility
- Ensure all dependencies are in package.json

### Runtime Issues
- Check health endpoint: `curl https://learnerlang.com/health.json`
- Verify static assets are loading
- Check browser console for errors

### Configuration Issues
- Verify environment variables are set
- Check site URL in astro.config.mjs
- Ensure nixpacks.toml is properly configured

## Local Testing

Test the production build locally:
```bash
npm run build
npm run preview
```

The site will be available at `http://localhost:4321`