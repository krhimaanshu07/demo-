# DICOM Insight - Medical Image Viewer

A full-stack DICOM viewer application with AI-powered diagnostic assistance.

## Features

- DICOM file upload and viewing
- Medical image comparison tools
- AI-powered diagnostic assistance
- Modern React-based UI
- Express.js backend API

## Deployment to Vercel

### Prerequisites

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

### Deploy

1. Build the project:
```bash
npm run vercel-build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

### Environment Variables

Set these in your Vercel dashboard:

- `NODE_ENV`: production
- `DATABASE_URL`: Your database connection string
- Any other environment variables your app needs

### Manual Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically build and deploy on each push

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database**: Drizzle ORM
- **Deployment**: Vercel 