# cPanel Deployment Guide for Your Next.js App

## Quick Fix for Missing Index File Issue

The issue you're experiencing is that cPanel expects traditional HTML files, but Next.js is a React application. Here's how to fix it:

## Option 1: Static Export (Recommended for cPanel)

1. **First, set your environment variables in cPanel:**
   - Go to cPanel → Advanced → Environment Variables
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

2. **Build the static version locally:**
   ```bash
   npm run build
   ```

3. **Upload the files:**
   - After build completes, you'll have an `out` folder
   - Upload ALL contents of the `out` folder to your cPanel's `public_html` directory
   - Make sure `index.html` is in the root of `public_html`

## Option 2: Node.js App (If cPanel supports Node.js)

If your cPanel hosting supports Node.js applications:

1. **Create Node.js App in cPanel:**
   - Go to cPanel → Software → Node.js Apps
   - Create new application
   - Set Node.js version to 18 or higher

2. **Upload your project:**
   - Upload all project files to the app directory
   - Install dependencies: `npm install`
   - Start the app: `npm start`

## Current Status

I've configured your app for static export. The build may fail due to some dynamic features. Let me know which option works better for your cPanel setup and I'll help you complete the deployment.

## Files You'll Upload to cPanel

After successful build, your `out` folder will contain:
- `index.html` (this is the missing file they mentioned)
- `_next/` folder with assets
- All your page files as HTML
- Static assets and images

## Troubleshooting

- **Missing index.html**: Make sure you upload the contents of `out` folder, not the folder itself
- **Blank page**: Check that environment variables are set correctly in cPanel
- **API errors**: Static export means some server features won't work; all data comes from Supabase directly
