# Setup Instructions

## Prerequisites

- Node.js 18+ and npm
- Chrome, Edge, or Firefox browser

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension in your browser:

### Chrome/Edge:
1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder

### Firefox:
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `dist/manifest.json`

## Development

For development with hot reload:
```bash
npm run dev
```

## First Time Setup

1. After installing, click the extension icon
2. Click "Set Up Profile" to create your professional vault
3. Fill in your personal information, skills, and upload resume versions
4. Configure AI provider settings if you want to use AI features

## Features

- **Professional Vault**: Store your profile, resumes, skills, and STAR stories
- **Job Analysis**: Automatically analyze job postings and get match scores
- **Resume Optimization**: Tailor your resume for each job application
- **Smart Autofill**: Intelligent form filling with review step
- **Application Tracking**: Track all your applications and outcomes

## Supported Platforms

- LinkedIn
- Indeed
- Greenhouse
- Lever
- Workday
- Generic career portals

## Notes

- Placeholder icons are included - replace with actual icons for production
- AI features require API keys (OpenAI or Anthropic) or local model setup
- All data is stored locally by default for privacy
