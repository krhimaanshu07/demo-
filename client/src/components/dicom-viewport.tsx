import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { DicomService } from '@/services/dicom-service';
import { DicomFileInfo } from '@/types/dicom';

interface DicomViewportProps {
  fileInfo: DicomFileInfo;
}

export function DicomViewport({ fileInfo }: DicomViewportProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!elementRef.current || !fileInfo.url) return;

      try {
        setIsLoading(true);
        setError(null);
        await DicomService.loadImage(elementRef.current, fileInfo.url);
      } catch (err) {
        setError('Failed to load DICOM image');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      if (elementRef.current) {
        DicomService.disableElement(elementRef.current);
      }
    };
  }, [fileInfo.url]);

  useEffect(() => {
    const handleResize = () => {
      if (elementRef.current) {
        DicomService.resizeViewport(elementRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => {
    // Zoom functionality would be implemented with cornerstone tools
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // Zoom functionality would be implemented with cornerstone tools
    console.log('Zoom out');
  };

  const handleReset = () => {
    if (elementRef.current) {
      try {
        // Reset view functionality would be implemented with cornerstone tools
        console.log('Reset view');
      } catch (err) {
        console.error('Failed to reset view:', err);
      }
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">DICOM Viewer</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} title="Reset View">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="h-full rounded-lg bg-black relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          <div
            ref={elementRef}
            className="w-full h-full"
            style={{ minHeight: '400px' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
