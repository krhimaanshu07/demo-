import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import { DicomMetadata } from '@/types/dicom';

// Initialize cornerstone and image loaders safely
if (typeof window !== 'undefined') {
  if (cornerstone.external) {
    cornerstone.external.cornerstone = cornerstone;
  }
  if (cornerstoneWADOImageLoader.external) {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  }
}

// Configure WADO image loader
cornerstoneWADOImageLoader.configure({
  useWebWorkers: false, // Disable web workers for simplicity
});

export class DicomService {
  static async loadImage(element: HTMLElement, imageUrl: string): Promise<void> {
    try {
      const imageId = `wadouri:${window.location.origin}${imageUrl}`;
      
      // Enable the element for cornerstone
      cornerstone.enable(element);
      
      // Load and display the image
      const image = await cornerstone.loadImage(imageId);
      cornerstone.displayImage(element, image);
      
      // Fit image to viewport
      cornerstone.fitToWindow(element);
    } catch (error) {
      console.error('Failed to load DICOM image:', error);
      throw error;
    }
  }

  static async parseMetadata(imageUrl: string): Promise<DicomMetadata> {
    try {
      const response = await fetch(`${window.location.origin}${imageUrl}`);
      const arrayBuffer = await response.arrayBuffer();
      
      const byteArray = new Uint8Array(arrayBuffer);
      const dataSet = dicomParser.parseDicom(byteArray);
      
      return {
        patientName: this.getStringValue(dataSet, 'x00100010'),
        patientId: this.getStringValue(dataSet, 'x00100020'),
        patientBirthDate: this.getStringValue(dataSet, 'x00100030'),
        patientSex: this.getStringValue(dataSet, 'x00100040'),
        studyDate: this.getStringValue(dataSet, 'x00080020'),
        studyDescription: this.getStringValue(dataSet, 'x00081030'),
        modality: this.getStringValue(dataSet, 'x00080060'),
        institution: this.getStringValue(dataSet, 'x00080080'),
        rows: this.getNumberValue(dataSet, 'x00280010'),
        columns: this.getNumberValue(dataSet, 'x00280011'),
        bitsAllocated: this.getNumberValue(dataSet, 'x00280100'),
        pixelSpacing: this.getStringValue(dataSet, 'x00280030'),
        windowWidth: this.getNumberValue(dataSet, 'x00281051'),
        windowCenter: this.getNumberValue(dataSet, 'x00281050'),
      };
    } catch (error) {
      console.error('Failed to parse DICOM metadata:', error);
      return {};
    }
  }

  private static getStringValue(dataSet: any, tag: string): string | undefined {
    const element = dataSet.elements[tag];
    if (element) {
      return dataSet.string(tag);
    }
    return undefined;
  }

  private static getNumberValue(dataSet: any, tag: string): number | undefined {
    const element = dataSet.elements[tag];
    if (element) {
      const value = dataSet.uint16(tag);
      return value !== undefined ? value : undefined;
    }
    return undefined;
  }

  static resizeViewport(element: HTMLElement): void {
    try {
      cornerstone.resize(element);
    } catch (error) {
      console.error('Failed to resize viewport:', error);
    }
  }

  static disableElement(element: HTMLElement): void {
    try {
      cornerstone.disable(element);
    } catch (error) {
      console.error('Failed to disable element:', error);
    }
  }
}
