# Deployment Guide

## Netlify Deployment

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Manual Deployment Steps

1. **Prepare the repository**
   ```bash
   git add .
   git commit -m "Convert to static web app for Netlify"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository
   
3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Node version**: 20 (set in `netlify.toml`)
   
4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://[random-name].netlify.app`

### Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

### Environment Variables

This app doesn't require any environment variables as it runs entirely in the browser.

## Alternative Deployment Options

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

### GitHub Pages

1. Update `vite.config.ts` to set base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. Build:
   ```bash
   cd frontend
   yarn build
   ```

3. Deploy to gh-pages branch:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

### Self-Hosting

1. Build the project:
   ```bash
   cd frontend
   yarn build
   ```

2. Copy the `dist` folder to your web server

3. Configure your server to:
   - Serve `index.html` for all routes
   - Enable gzip compression
   - Set proper cache headers

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/mindwell/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache Configuration (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Post-Deployment

### Verify Functionality

After deployment, test:
- ✅ Home page loads
- ✅ Navigation works
- ✅ Can create mood entries
- ✅ Data persists after page refresh
- ✅ Export data functionality works
- ✅ Import data functionality works
- ✅ Analytics charts display correctly
- ✅ All 56 emotions are available

### Performance Optimization

The build is already optimized, but you can further improve:

1. **Enable CDN** (usually automatic with Netlify)
2. **Enable HTTP/2** (usually automatic)
3. **Configure caching headers**
4. **Use a service worker** for offline support (optional enhancement)

## Monitoring

### Netlify Analytics

Enable Netlify Analytics for:
- Page views
- Unique visitors
- Top pages
- Bandwidth usage

### Custom Analytics

If you want to add analytics:
1. Add Google Analytics, Plausible, or Fathom
2. Update `index.html` with tracking code
3. Ensure privacy compliance

## Backup Strategy

Since data is stored locally:
1. Encourage users to export data regularly
2. Consider adding automatic backup reminders
3. Document export/import process clearly

## Troubleshooting

### Build Fails
- Check Node version (should be 20+)
- Verify all dependencies are installed
- Check build logs for specific errors

### Routes Don't Work
- Ensure `_redirects` file is in `public` folder
- Verify `netlify.toml` is in root directory

### Data Not Persisting
- Check browser console for IndexedDB errors
- Verify browser supports IndexedDB
- Test in different browsers

## Updates and Maintenance

### Updating Dependencies
```bash
cd frontend
yarn upgrade-interactive --latest
```

### Security Updates
```bash
yarn audit
yarn audit fix
```

## Cost Considerations

### Netlify Free Tier
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ CDN included
- ✅ Unlimited sites

This is typically sufficient for personal use or small teams.

### Upgrading
Consider upgrading if you need:
- More bandwidth
- Priority builds
- More team members
- Advanced features

## Support

For deployment issues:
1. Check Netlify documentation
2. Review build logs
3. Test locally first
4. Check browser console for errors

For app issues:
1. Check browser compatibility
2. Verify IndexedDB support
3. Test export/import functionality
4. Clear browser data and retry