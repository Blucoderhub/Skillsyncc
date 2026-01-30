# Job Application Copilot

AI-powered browser extension that helps you optimize resumes, analyze job descriptions, and complete job applications smarter and faster.

This repository includes both the browser extension and a companion web application optimized for deployment on Vercel.

## Features

### Browser Extension


- 🎯 **Job Description Intelligence** - Analyze job postings and get skill match scores
- 📝 **ATS Optimization** - Tailor your resume for each application
- 🤖 **Smart Autofill** - Intelligent form filling with review step
- 💬 **Application Copilot** - Generate optimized answers to common questions
- 📊 **Application Tracking** - Track all your applications and outcomes
- 🔗 **Referral Assistant** - Draft personalized outreach messages
- 🔒 **Privacy-First** - Your data stays secure and private

## Installation

### Development

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension:
   - Open Chrome/Edge: `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Production

Build for production:
```bash
npm run build
```

## Project Structure

### Extension Structure
```text
├── src/
│   ├── popup/          # Extension popup UI
│   ├── options/         # Options/settings page
│   ├── content/         # Content scripts for job sites
│   ├── background/      # Background service worker
│   ├── shared/          # Shared utilities and types
│   │   ├── storage/     # Storage management
│   │   ├── ai/          # AI service integration
│   │   ├── vault/       # Professional vault
│   │   └── platforms/   # Platform-specific adapters
│   └── types/           # TypeScript types
├── manifest.json        # Extension manifest
└── package.json         # Dependencies
```

### Web Application
The `/web` directory contains a Next.js application optimized for deployment on Vercel:

```
├── web/
│   ├── app/            # Next.js 15 App Router
│   ├── public/         # Static assets
│   ├── package.json    # Web app dependencies
│   ├── vercel.json     # Vercel deployment configuration
│   └── README.md       # Web app deployment guide
```

```
├── src/
│   ├── popup/          # Extension popup UI
│   ├── options/         # Options/settings page
│   ├── content/         # Content scripts for job sites
│   ├── background/      # Background service worker
│   ├── shared/          # Shared utilities and types
│   │   ├── storage/     # Storage management
│   │   ├── ai/          # AI service integration
│   │   ├── vault/       # Professional vault
│   │   └── platforms/   # Platform-specific adapters
│   └── types/           # TypeScript types
├── manifest.json        # Extension manifest
└── package.json         # Dependencies
```

## Usage

1. **Setup**: Open the extension options to create your professional vault
2. **Job Search**: Visit job pages on supported platforms
3. **Optimize**: Click the extension icon to analyze and optimize
4. **Apply**: Use smart autofill with review before submitting

## Supported Platforms

- LinkedIn
- Indeed
- Greenhouse
- Lever
- Workday
- Generic career portals

## Privacy & Security

- All data stored locally by default
- Optional encrypted cloud sync
- No data sold or shared
- User approval required for all actions

## Deployment

### Browser Extension

Package and distribute the extension through the Chrome Web Store or Microsoft Edge Add-ons marketplace.

### Web Application

The companion web application is optimized for deployment on Vercel:

1. Navigate to the `/web` directory
2. Connect your GitHub repository to Vercel for automatic deployments
3. Or deploy manually using the Vercel CLI

See `web/README.md` for detailed deployment instructions.

## License

MIT
