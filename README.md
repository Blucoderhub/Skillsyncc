# Job Application Copilot

AI-powered job application assistant that optimizes resumes, analyzes job descriptions, and helps you apply smarter.

## Features

- 🚀 **Resume Optimizer**: AI-powered resume optimization for specific job descriptions
- 🛡️ **ATS Defender**: Defensive AI that makes your resume ATS-friendly
- 🤖 **Auto ATS Optimizer**: Automatically extracts job descriptions from web pages and optimizes your resume
- 🔍 **Job Analyzer**: Analyze job requirements and match with your skills
- ⚡ **Auto-Fill Forms**: Automatically fill application forms with your data
- 📊 **Application Tracker**: Monitor all your job applications in one place
- 🏠 **Dashboard**: Central hub for all features and progress tracking

## Installation

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select this folder (the root folder containing manifest.json)
4. The extension will be installed and ready to use

## Troubleshooting

If the popup doesn't appear:
- Make sure all files are in the correct locations
- Verify that the extension is enabled in Chrome
- Check that you loaded the root folder (containing manifest.json)
- Restart Chrome if needed

## Usage

Click the extension icon to open the popup and access any feature. Each feature opens in a new tab with a beautiful dark glass theme.

## Configuration

Click the gear icon in the extension popup or visit the options page to configure:
- API keys for OpenAI and Anthropic
- AI model preferences
- Auto-fill settings

## Current Status

All features are fully functional with a beautiful dark glass theme. The extension has been built and is ready to use. The compiled files are located in the `dist` folder.

## Architecture

- **Frontend**: React with TypeScript
- **Backend**: Chrome Extension Background Scripts
- **AI Integration**: OpenAI and Anthropic Claude APIs
- **Storage**: Chrome Storage API for local data persistence
- **UI/UX**: Dark glass theme with frosted glass effects

## Claude Integration

The extension uses Anthropic's Claude models with intelligent model selection:
- **Haiku**: For quick tasks like autofill
- **Sonnet**: For balanced performance (recommended)
- **Opus**: For complex job matching and analysis

## ATS Optimization

Advanced ATS-friendly resume optimization with file upload capability. The system acts as a defensive AI against Applicant Tracking Systems.