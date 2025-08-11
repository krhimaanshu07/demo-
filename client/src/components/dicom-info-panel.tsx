import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DicomService } from '@/services/dicom-service';
import { DicomMetadata, DicomFileInfo } from '@/types/dicom';

interface DicomInfoPanelProps {
  fileInfo: DicomFileInfo;
  isProcessed?: boolean;
}

export function DicomInfoPanel({ fileInfo, isProcessed = false }: DicomInfoPanelProps) {
  const [metadata, setMetadata] = useState<DicomMetadata>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const parseMetadata = async () => {
      if (!fileInfo.url) return;

      try {
        setIsLoading(true);
        const meta = await DicomService.parseMetadata(fileInfo.url);
        setMetadata(meta);
      } catch (err) {
        console.error('Failed to parse DICOM metadata:', err);
      } finally {
        setIsLoading(false);
      }
    };

    parseMetadata();
  }, [fileInfo.url]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{isProcessed ? 'Enhanced Image Info' : 'DICOM Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const InfoSection = ({ title, items }: { title: string; items: Array<{ label: string; value: string | number | undefined }> }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map(({ label, value }, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {value || 'N/A'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{isProcessed ? 'Enhanced Image Info' : 'DICOM Information'}</CardTitle>
        {isProcessed && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-processed DICOM metadata
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-320px)]">
        <div className="space-y-6 pr-2">
          {isProcessed && (
            <InfoSection
              title="AI Processing"
              items={[
                { label: 'Algorithm', value: 'Gen AI DR v2.1' },
                { label: 'Processing Time', value: '2.3 seconds' },
                { label: 'Enhancement Level', value: 'High' },
              ]}
            />
          )}

          {isProcessed && (
            <InfoSection
              title="Quality Metrics"
              items={[
                { label: 'SNR Improvement', value: '+45%' },
                { label: 'Contrast Enhancement', value: '+32%' },
                { label: 'Noise Reduction', value: '-28%' },
              ]}
            />
          )}

          <InfoSection
            title="Patient Information"
            items={[
              { label: 'Patient Name', value: metadata.patientName },
              { label: 'Patient ID', value: metadata.patientId },
              { label: 'Birth Date', value: metadata.patientBirthDate },
              { label: 'Sex', value: metadata.patientSex },
            ]}
          />

          <InfoSection
            title="Study Information"
            items={[
              { label: 'Study Date', value: metadata.studyDate },
              { label: 'Study Description', value: metadata.studyDescription },
              { label: 'Modality', value: metadata.modality },
              { label: 'Institution', value: metadata.institution },
            ]}
          />

          <InfoSection
            title={isProcessed ? 'Technical Details' : 'Image Information'}
            items={[
              ...(isProcessed ? [
                { label: 'Output Format', value: 'DICOM 16-bit' },
                { label: 'File Size', value: `${(fileInfo.fileSize / (1024 * 1024)).toFixed(1)} MB` },
                { label: 'Compression', value: 'Lossless' },
              ] : []),
              { label: 'Rows', value: metadata.rows },
              { label: 'Columns', value: metadata.columns },
              { label: 'Bits Allocated', value: metadata.bitsAllocated },
              { label: 'Pixel Spacing', value: metadata.pixelSpacing },
              { label: 'Window Width', value: metadata.windowWidth },
              { label: 'Window Center', value: metadata.windowCenter },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
