import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertDicomFileSchema, uploadResponseSchema, processResponseSchema } from "@shared/schema";
import { randomUUID } from "crypto";

const uploadsDir = path.join(process.cwd(), 'server', 'uploads');
const samplesDir = path.join(process.cwd(), 'server', 'samples');

// Ensure directories exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueId = randomUUID();
      cb(null, `${uniqueId}.dcm`);
    }
  }),
  fileFilter: (req, file, cb) => {
    // Check file extension
    if (path.extname(file.originalname).toLowerCase() !== '.dcm') {
      return cb(new Error('Only DICOM (.dcm) files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS for local development
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Serve uploads directory statically
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  }, express.static(uploadsDir));

  // POST /api/upload - Upload DICOM file
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.file;
      
      // Basic DICOM magic bytes validation (optional)
      const fileBuffer = fs.readFileSync(file.path);
      const magicBytes = fileBuffer.slice(128, 132).toString();
      if (magicBytes !== 'DICM') {
        // Not a strict validation, just a warning
        console.warn('File may not be a valid DICOM file (missing DICM magic bytes)');
      }

      // Save file record to storage
      const dicomFile = await storage.createDicomFile({
        originalName: file.originalname,
        filename: file.filename,
        filepath: file.path,
        fileSize: file.size,
        processed: false,
        processedFileId: null,
      });

      const response = uploadResponseSchema.parse({
        success: true,
        fileId: dicomFile.id,
        url: `/uploads/${file.filename}`,
      });

      res.json(response);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  // GET /api/file/:id - Get file info
  app.get('/api/file/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getDicomFile(id);
      
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.json({
        id: file.id,
        originalName: file.originalName,
        url: `/uploads/${file.filename}`,
        fileSize: file.fileSize,
        uploadedAt: file.uploadedAt,
      });
    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({ error: 'Failed to get file info' });
    }
  });

  // POST /api/process/:fileId - Process DICOM file (simulate AI enhancement)
  app.post('/api/process/:fileId', async (req, res) => {
    try {
      const { fileId } = req.params;
      const originalFile = await storage.getDicomFile(fileId);
      
      if (!originalFile) {
        return res.status(404).json({ error: 'Original file not found' });
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Copy original file to create "processed" version
      const resultId = randomUUID();
      const processedFilename = `${resultId}.dcm`;
      const processedPath = path.join(uploadsDir, processedFilename);
      
      fs.copyFileSync(originalFile.filepath, processedPath);

      // Create processed file record
      const processedFile = await storage.createDicomFile({
        originalName: `processed_${originalFile.originalName}`,
        filename: processedFilename,
        filepath: processedPath,
        fileSize: originalFile.fileSize,
        processed: true,
        processedFileId: null,
      });

      // Update original file to mark as processed
      await storage.updateDicomFile(fileId, {
        processed: true,
        processedFileId: processedFile.id,
      });

      const response = processResponseSchema.parse({
        success: true,
        resultId: processedFile.id,
        url: `/uploads/${processedFilename}`,
      });

      res.json(response);
    } catch (error) {
      console.error('Process error:', error);
      res.status(500).json({ error: 'Failed to process file' });
    }
  });

  // GET /api/download/:id - Download DICOM file
  app.get('/api/download/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getDicomFile(id);
      
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      if (!fs.existsSync(file.filepath)) {
        return res.status(404).json({ error: 'File not found on disk' });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
      res.setHeader('Content-Type', 'application/dicom');
      
      const fileStream = fs.createReadStream(file.filepath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
