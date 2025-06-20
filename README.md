# BibleQuest

An interactive children's Bible story app with quizzes, character journeys, and educational content.

## Features

- 📖 Interactive Bible Stories
- 🎯 Character-based Quizzes
- 🏆 Achievement System
- 📊 Progress Tracking
- 🌙 Dark Mode Support
- 📱 Responsive Design
- 🎨 Accessibility Features

## Quick Start

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Deployment

#### Deploy to Netlify (Recommended)

1. **Via Netlify UI:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Deploy!

2. **Via Netlify CLI:**
   ```bash
   # Login to Netlify
   netlify login
   
   # Deploy to production
   netlify deploy --prod
   ```

#### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `build/` folder to your hosting provider

## Project Structure

```
bible-quest/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── data/          # Static data and questions
│   ├── App.tsx        # Main app component
│   └── index.tsx      # App entry point
├── public/            # Static assets
├── build/             # Production build (generated)
├── netlify.toml       # Netlify configuration
└── package.json       # Dependencies and scripts
```

## Configuration

The app is configured to use:
- **Backend API**: `https://bible-quest-lvwg.onrender.com`
- **Build Output**: `build/` directory
- **Client-side Routing**: Handled by `_redirects` file

## Environment Variables

If needed, set these in your hosting platform:
- `REACT_APP_BIBLE_API_KEY` - Bible API key (optional)

## Technologies Used

- React 18
- TypeScript
- React Router
- Capacitor (for mobile apps)
- Netlify (deployment)

## Support

For deployment issues, check:
1. Build logs in your hosting platform
2. Browser console for errors
3. Network connectivity to backend API
4. Static asset paths

## License

This project is part of the BibleQuest educational platform.
