# Overview

This is a full-stack DICOM medical image viewer application with AI enhancement capabilities. The application provides a 3-page workflow: upload DICOM files, view them with metadata extraction, and compare original vs AI-processed images. Built as a medical imaging platform for diagnostic radiology with simulated AI enhancement features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing with 3 main routes (upload, viewer, compare)
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **DICOM Rendering**: Cornerstone.js ecosystem including:
  - cornerstone-core for image viewport management
  - cornerstone-wado-image-loader for DICOM file loading
  - dicom-parser for metadata extraction

## Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **File Handling**: Multer middleware for DICOM file uploads with validation
- **Storage Strategy**: Local filesystem storage in `/server/uploads` directory
- **API Design**: RESTful endpoints for upload, processing, file serving, and downloads
- **Development**: Hot reload with Vite integration in development mode

## Data Storage Solutions
- **File Storage**: Local filesystem with organized directory structure
- **Metadata Storage**: In-memory storage (MemStorage class) for development
- **Database Schema**: Drizzle ORM configured for PostgreSQL with DICOM file metadata tracking
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

## Authentication and Authorization
- **Current State**: No authentication implemented (development/demo phase)
- **Session Infrastructure**: Basic session middleware configured but not actively used
- **Future Ready**: Database schema and session store prepared for user authentication

## External Dependencies

### Core Frontend Libraries
- **React Ecosystem**: React 18 with TypeScript, React Router (Wouter), React Query
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens and dark mode support

### DICOM Processing
- **cornerstone-core**: Medical image viewport rendering and manipulation
- **cornerstone-wado-image-loader**: DICOM file format support and image loading
- **dicom-parser**: DICOM metadata extraction and tag parsing

### Backend Services
- **Database**: PostgreSQL with Neon serverless (@neondatabase/serverless)
- **ORM**: Drizzle with Zod validation for type-safe database operations
- **File Upload**: Multer with disk storage configuration

### Development Tools
- **Build System**: Vite with ESBuild for fast compilation
- **Type Safety**: TypeScript with strict mode enabled
- **Code Quality**: ESM modules throughout the application
- **Hot Reload**: Vite dev server with custom error overlay for Replit

### Deployment Infrastructure
- **Platform**: Designed for Replit deployment with custom configuration
- **Static Assets**: Vite build output served through Express
- **Environment**: Environment-based configuration for development/production