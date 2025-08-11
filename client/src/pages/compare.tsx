import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { DicomInfoPanel } from '@/components/dicom-info-panel';
import { FooterBar } from '@/components/footer-bar';
import { DicomFileInfo } from '@/types/dicom';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Compare() {
  const { fileId, resultId } = useParams<{ fileId: string; resultId: string }>();

  const { data: originalFile, isLoading: loadingOriginal } = useQuery<DicomFileInfo>({
    queryKey: ['/api/file', fileId],
    enabled: !!fileId,
  });

  const { data: processedFile, isLoading: loadingProcessed } = useQuery<DicomFileInfo>({
    queryKey: ['/api/file', resultId],
    enabled: !!resultId,
  });

  const isLoading = loadingOriginal || loadingProcessed;
  const hasError = !originalFile || !processedFile;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Files Not Found</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            The requested DICOM files could not be found. Please check the URL or process a new file.
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
            <BeforeAfterSlider 
              originalFile={originalFile}
              processedFile={processedFile}
            />
          </div>
          <div className="lg:col-span-1">
            <DicomInfoPanel fileInfo={processedFile} isProcessed />
          </div>
        </div>
      </div>
      <div className="mt-auto max-w-7xl mx-auto px-4 pb-6 w-full">
        <FooterBar 
          type="download" 
          fileId={fileId!}
          resultId={resultId}
        />
      </div>
    </div>
  );
}
