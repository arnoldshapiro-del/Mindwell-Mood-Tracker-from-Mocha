# Mindwell Mood Tracker

A privacy-first mood tracking application with clinical-grade analytics, converted from Cloudflare Workers to a static web app with browser storage.

## 🎯 Features

- **Mood Tracking**: Track mood, anxiety, energy levels, and sleep quality with 4-point scales
- **56 Emotions**: Comprehensive emotion tracking with intensity levels
  - Positive emotions (Joy, Happiness, Contentment, Gratitude, Love, Pride, Hope, etc.)
  - Negative emotions (Sadness, Anger, Fear, Anxiety, Frustration, Grief, etc.)
  - Neutral emotions (Surprise, Curiosity, Boredom, Acceptance, etc.)
  - Complex emotions (Overwhelmed, Confident, Motivated, Vulnerable, etc.)
- **Activities Tracking**: Log daily activities and correlate with mood patterns
- **Medication Management**: Track medications and dosage
- **Analytics**: Visual charts and trend analysis (daily, weekly, monthly)
- **Emotion Analytics**: Frequency and intensity analysis of emotions
- **Data Management**: Export/Import functionality for backup and restore
- **Privacy First**: All data stored locally in browser (IndexedDB)
- **Offline Support**: Works completely offline

## 🏗️ Architecture

### Original (Cloudflare Workers)
- Cloudflare Workers backend (Hono)
- D1 Database (SQLite)
- React frontend with Vite

### Converted (Static Web App)
- Pure React frontend with TypeScript
- IndexedDB for local browser storage
- Vite for build tooling
- No backend required

## 📦 Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Storage**: IndexedDB
- **Validation**: Zod
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mindwell-mood-tracker
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
yarn install
# or
npm install
```

### Development

Start the development server:
```bash
yarn dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

Build for production:
```bash
yarn build
# or
npm run build
```

The build output will be in the `frontend/dist` directory.

Preview production build:
```bash
yarn preview
# or
npm run preview
```

## 🌐 Deployment to Netlify

### Option 1: Using Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
cd frontend
yarn build
```

3. Deploy:
```bash
netlify deploy --prod
```

### Option 2: Using Netlify UI

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Click "Deploy site"

### Option 3: Manual Deploy

1. Build the project:
```bash
cd frontend
yarn build
```

2. Drag and drop the `frontend/dist` folder to Netlify's deploy interface

## 📁 Project Structure

```
/app
├── frontend/
│   ├── src/
│   │   ├── react-app/
│   │   │   ├── components/     # React components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── pages/          # Page components
│   │   │   └── App.tsx         # Main app component
│   │   ├── shared/
│   │   │   └── types.ts        # Shared TypeScript types
│   │   ├── utils/
│   │   │   ├── db.ts           # IndexedDB wrapper
│   │   │   └── emotions-data.ts # 56 emotions data
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/
│   │   └── _redirects          # Netlify redirects
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── netlify.toml                # Netlify configuration
└── README.md
```

## 💾 Data Storage

All data is stored locally in your browser using IndexedDB:

- **mood_entries**: Mood tracking entries
- **emotions**: 56 predefined emotions
- **mood_entry_emotions**: Junction table for mood-emotion relationships
- **medications**: Medication list
- **medication_logs**: Medication intake logs
- **activities**: Activity list

### Data Backup

Use the **Data Management** page to:
- Export all data as JSON
- Import previously exported data
- Backup regularly to prevent data loss

## 🎨 Features Detail

### Mood Tracking
- 4-point scales for mood, anxiety, energy, and sleep
- Time of day selector (morning, afternoon, evening)
- Multiple emotion selection with intensity levels
- Activity tracking
- Notes for each entry

### Analytics
- Daily, weekly, and monthly trend charts
- Emotion frequency and intensity analysis
- Time pattern analysis
- Category-based emotion grouping

### Data Privacy
- No server or backend required
- All data stored locally in browser
- No third-party tracking
- No data sent to external servers
- Optional export for personal backups

## 🔧 Configuration

### Tailwind CSS
The app uses Tailwind CSS with custom configuration in `tailwind.config.js`.

### Vite
Build configuration is in `vite.config.ts` with path aliases set up.

### TypeScript
TypeScript configuration is in `tsconfig.json` with strict mode enabled.

## 🐛 Troubleshooting

### Data not persisting
- Make sure you're not in private/incognito mode
- Check browser settings for IndexedDB support
- Try exporting data and reimporting

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && yarn install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Netlify deployment issues
- Verify `netlify.toml` configuration
- Check build logs for errors
- Ensure base directory is set to `frontend`

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Original app created using [Mocha](https://getmocha.com)
- Converted from Cloudflare Workers to static web app
- Emotion list based on psychological research and Ekman's basic emotions

## 🔄 Migration from Cloudflare Workers

This app was converted from a Cloudflare Workers application to a static web app:

### Changes Made:
- ✅ Removed Hono backend and Cloudflare Workers
- ✅ Replaced D1 Database with IndexedDB
- ✅ Converted all API endpoints to client-side functions
- ✅ Added data export/import functionality
- ✅ Configured for Netlify deployment
- ✅ Maintained all 56 emotions from original migrations
- ✅ Kept all original features (mood tracking, analytics, medications)

### Benefits:
- ✨ No backend maintenance required
- ✨ Completely free to host (Netlify free tier)
- ✨ Faster load times (no API calls)
- ✨ Works offline
- ✨ True privacy-first (no data leaves browser)