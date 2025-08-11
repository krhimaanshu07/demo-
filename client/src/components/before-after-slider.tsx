import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';
import { DicomService } from '@/services/dicom-service';
import { DicomFileInfo } from '@/types/dicom';

interface BeforeAfterSliderProps {
  originalFile: DicomFileInfo;
  processedFile: DicomFileInfo;
}

export function BeforeAfterSlider({ originalFile, processedFile }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const originalViewportRef = useRef<HTMLDivElement>(null);
  const processedViewportRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      if (!originalViewportRef.current || !processedViewportRef.current) return;

      try {
        const originalUrl = isSwapped ? processedFile.url : originalFile.url;
        const processedUrl = isSwapped ? originalFile.url : processedFile.url;

        await Promise.all([
          DicomService.loadImage(originalViewportRef.current, originalUrl),
          DicomService.loadImage(processedViewportRef.current, processedUrl),
        ]);
        
        setImagesLoaded(true);
      } catch (err) {
        console.error('Failed to load images:', err);
      }
    };

    loadImages();

    return () => {
      if (originalViewportRef.current) {
        DicomService.disableElement(originalViewportRef.current);
      }
      if (processedViewportRef.current) {
        DicomService.disableElement(processedViewportRef.current);
      }
    };
  }, [originalFile.url, processedFile.url, isSwapped]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Before / After Comparison</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleSwap} title="Swap Images">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            Drag to compare
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div
          ref={containerRef}
          className="relative h-full rounded-lg overflow-hidden bg-black"
          style={{ minHeight: '400px' }}
        >
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          )}
          
          {/* Before Image Container */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div
              ref={originalViewportRef}
              className="w-full h-full"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              {isSwapped ? 'AI ENHANCED' : 'ORIGINAL'}
            </div>
          </div>

          {/* After Image Container */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <div
              ref={processedViewportRef}
              className="w-full h-full"
            />
            <div className="absolute top-2 right-2 bg-primary bg-opacity-90 text-white px-2 py-1 rounded text-xs">
              {isSwapped ? 'ORIGINAL' : 'AI ENHANCED'}
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 h-full w-1 bg-primary cursor-ew-resize z-20"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary border-3 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
