# BibleQuest Deployment Guide

## Deploying to Netlify

### Prerequisites
- A Netlify account (free at netlify.com)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Prepare Your Repository

1. Make sure your code is committed and pushed to your Git repository
2. Ensure the following files are in your repository:
   - `netlify.toml` (deployment configuration)
   - `public/_redirects` (for client-side routing)
   - `package.json` (with build script)

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your BibleQuest repository
5. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Node version**: `18` (or latest LTS)
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy from your project directory:
   ```bash
   netlify deploy --prod
   ```

### Step 3: Configure Environment Variables (Optional)

If you need to set environment variables in Netlify:

1. Go to your site's dashboard in Netlify
2. Navigate to Site settings → Environment variables
3. Add any required environment variables:
   - `REACT_APP_BIBLE_API_KEY` (if needed)

### Step 4: Custom Domain (Optional)

1. In your Netlify dashboard, go to Domain settings
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

### Step 5: Verify Deployment

1. Check that your site is accessible at the provided Netlify URL
2. Test all major functionality:
   - Character selection
   - Bible stories
   - Quizzes
   - Dashboard
   - Responsive design

### Troubleshooting

#### Build Failures
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### Routing Issues
- Ensure `public/_redirects` file is present
- Check that `netlify.toml` has proper redirect configuration

#### API Issues
- Verify your backend API is accessible
- Check CORS configuration on your backend
- Ensure API endpoints are correctly configured in `src/config.js`

### Current Configuration

Your app is configured to use:
- **Backend API**: `https://bible-quest-lvwg.onrender.com`
- **Build Output**: `build/` directory
- **Client-side Routing**: Handled by `_redirects` file
- **Static Assets**: Served from `public/` directory

### Performance Optimization

The deployment includes:
- Static asset caching (1 year for JS/CSS files)
- Security headers
- Optimized build output
- Client-side routing support

### Support

If you encounter issues:
1. Check the Netlify build logs
2. Verify your local build works (`npm run build`)
3. Check the browser console for errors
4. Ensure all static assets are properly referenced 