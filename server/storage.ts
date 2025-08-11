import { type DicomFile, type InsertDicomFile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // DICOM file operations
  createDicomFile(file: InsertDicomFile): Promise<DicomFile>;
  getDicomFile(id: string): Promise<DicomFile | undefined>;
  updateDicomFile(id: string, updates: Partial<DicomFile>): Promise<DicomFile | undefined>;
  deleteDicomFile(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private dicomFiles: Map<string, DicomFile>;

  constructor() {
    this.dicomFiles = new Map();
  }

  async createDicomFile(insertFile: InsertDicomFile): Promise<DicomFile> {
    const id = randomUUID();
    const file: DicomFile = {
      id,
      originalName: insertFile.originalName,
      filename: insertFile.filename,
      filepath: insertFile.filepath,
      fileSize: insertFile.fileSize,
      processed: insertFile.processed ?? false,
      processedFileId: insertFile.processedFileId ?? null,
      uploadedAt: new Date(),
    };
    this.dicomFiles.set(id, file);
    return file;
  }

  async getDicomFile(id: string): Promise<DicomFile | undefined> {
    return this.dicomFiles.get(id);
  }

  async updateDicomFile(id: string, updates: Partial<DicomFile>): Promise<DicomFile | undefined> {
    const existingFile = this.dicomFiles.get(id);
    if (!existingFile) return undefined;

    const updatedFile = { ...existingFile, ...updates };
    this.dicomFiles.set(id, updatedFile);
    return updatedFile;
  }

  async deleteDicomFile(id: string): Promise<boolean> {
    return this.dicomFiles.delete(id);
  }
}

export const storage = new MemStorage();
