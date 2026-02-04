# Database Setup

## 1. Environment Variables

Create a `.env.local` file in the root of your `web` directory:

```env
# Database Connection
POSTGRES_URL="postgresql://username:password@localhost:5432/skillsyncc"

# For Vercel Deployment (automatically set)
# POSTGRES_URL="postgres://default:password@ep-cool-space-xxxx.us-east-1.aws.com:5432/verceldb"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# OpenAI API Key (optional)
OPENAI_API_KEY="sk-your-openai-key"

# Anthropic API Key (optional)
ANTHROPIC_API_KEY="sk-ant-your-api-key"

# Site URL
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"

# Development
NODE_ENV="development"
```

## 2. Database Setup Options

### Option A: Local Development with Docker
```bash
# Start PostgreSQL with Docker
docker run --name skillsyncc-db \
  -e POSTGRES_PASSWORD=skillsyncc123 \
  -e POSTGRES_USER=skillsyncc \
  -e POSTGRES_DB=skillsyncc \
  -p 5432:5432 \
  postgres:15

# Install dependencies
npm install

# Run database migrations
npm run db:push
```

### Option B: Vercel Postgres (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Add Postgres database
vercel postgres create
vercel env pull POSTGRES_URL
```

### Option C: Supabase (Alternative)
```env
# Use Supabase URL
POSTGRES_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
```

## 3. Install Required Dependencies

```bash
npm install @vercel/postgres drizzle-orm drizzle-zod drizzle-kit
```

## 4. Database Schema

The schema is already defined in `lib/schema.ts`. To create tables:

```bash
# Generate migrations
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push

# For production
npm run db:push
```

## 5. Connection Test

Create this API endpoint to test: `app/api/test-db/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { db, testConnection } from '@/lib/db';

export async function GET() {
  const isConnected = await testConnection();
  
  return NextResponse.json({
    success: isConnected,
    message: isConnected ? 'Database connected successfully' : 'Database connection failed',
    timestamp: new Date().toISOString()
  });
}
```

## 6. Vercel Configuration

Update `vercel.json`:

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "env": {
    "POSTGRES_URL": "@postgres_db"
  }
}
```

## 7. Package.json Scripts

Add these scripts to your `web/package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 8. Troubleshooting

### Common Issues:

1. **"Unable to connect" Error**
   - Check POSTGRES_URL in environment
   - Ensure database server is running
   - Verify network connectivity

2. **"Relation does not exist" Error**
   - Run `npm run db:push` to create tables
   - Check schema matches database

3. **CORS Issues**
   - Ensure API routes handle CORS properly
   - Check Vercel domain configuration

4. **Import Errors**
   - Verify all drizzle imports are correct
   - Check TypeScript configuration

### Test Database Connection:
Visit: `http://localhost:3000/api/test-db`

Expected response:
```json
{
  "success": true,
  "message": "Database connected successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```