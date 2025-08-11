export interface DicomMetadata {
  patientName?: string;
  patientId?: string;
  patientBirthDate?: string;
  patientSex?: string;
  studyDate?: string;
  studyDescription?: string;
  modality?: string;
  institution?: string;
  rows?: number;
  columns?: number;
  bitsAllocated?: number;
  pixelSpacing?: string;
  windowWidth?: number;
  windowCenter?: number;
}

export interface DicomFileInfo {
  id: string;
  originalName: string;
  url: string;
  fileSize: number;
  uploadedAt: string;
}
