import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { DicomViewport } from '@/components/dicom-viewport';
import { DicomInfoPanel } from '@/components/dicom-info-panel';
import { FooterBar } from '@/components/footer-bar';
import { DicomFileInfo } from '@/types/dicom';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Viewer() {
  const { fileId } = useParams<{ fileId: string }>();

  const { data: fileInfo, isLoading, error } = useQuery<DicomFileInfo>({
    queryKey: ['/api/file', fileId],
    enabled: !!fileId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !fileInfo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Not Found</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            The requested DICOM file could not be found. Please check the URL or upload a new file.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          <div className="lg:col-span-2">
            <DicomViewport fileInfo={fileInfo} />
          </div>
          <div className="lg:col-span-1">
            <DicomInfoPanel fileInfo={fileInfo} />
          </div>
        </div>
      </div>
      <div className="mt-auto max-w-7xl mx-auto px-4 pb-6 w-full">
        <FooterBar 
          type="process" 
          fileId={fileId!}
          onProcess={() => {
            // Navigation will be handled by the FooterBar component
          }}
        />
      </div>
    </div>
  );
}
