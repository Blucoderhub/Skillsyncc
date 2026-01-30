# Skillsyncc Web Application

The web application component of the Skillsyncc AI Career Copilot, designed for optimal deployment on Vercel.

## Deployment to Vercel

This application is optimized for deployment on Vercel. You can deploy it in several ways:

### 1. One-Click Deploy (Recommended)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/skillsyncc-web&project-name=skillsyncc-web&repo-name=skillsyncc-web)

### 2. Manual Deployment

1. Install the Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to the web directory:
```bash
cd web
```

3. Deploy:
```bash
vercel --prod
```

### 3. Git Integration

Connect your GitHub repository to Vercel for automatic deployments on push.

## Environment Variables

If you have environment variables, add them in the Vercel dashboard under Settings > Environment Variables:

- `NEXT_PUBLIC_*` variables are automatically available in the client-side code
- Server-side environment variables are kept secure

## Build Configuration

- Framework: Next.js 15
- Node.js Version: >=18.0.0
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Features

- Modern UI/UX with glassmorphism design inspired by weekday.work
- SEO optimized with comprehensive metadata and OpenGraph tags
- Responsive design for all device sizes
- Optimized performance with Next.js 15 features
- TypeScript for type safety
- Tailwind CSS for styling

## Development

To run locally:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the application.