import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { DicomService } from "@/services/dicom-service";
import { DicomFileInfo } from "@/types/dicom";

interface BeforeAfterSliderProps {
  originalFile: DicomFileInfo;
  processedFile: DicomFileInfo;
}

export function BeforeAfterSlider({
  originalFile,
  processedFile,
}: BeforeAfterSliderProps) {
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
        console.error("Failed to load images:", err);
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

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const handleSwap = () => {
    setIsSwapped(!isSwapped);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold truncate">
          Before / After Comparison
        </CardTitle>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwap}
            title="Swap Images"
            className="p-1.5 sm:p-2"
          >
            <ArrowLeftRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 bg-black dark:bg-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden sm:inline">
            Drag to compare
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-2 sm:p-4">
        <div
          ref={containerRef}
          className="relative h-full rounded-lg overflow-hidden bg-black touch-pan-x"
          style={{ minHeight: "300px" }}
        >
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          )}

          {/* Before Image Container */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div ref={originalViewportRef} className="w-full h-full" />
            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black bg-opacity-70 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
              {isSwapped ? "DR" : "CR"}
            </div>
          </div>

          {/* After Image Container */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            <div ref={processedViewportRef} className="w-full h-full" />
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black bg-opacity-90 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
              {isSwapped ? "CR" : "DR"}
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 h-full w-0.5 sm:w-1 bg-transparent cursor-ew-resize z-20 touch-manipulation"
            style={{
              left: `${sliderPosition}%`,
              transform: "translateX(-50%)",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-6 h-6 sm:w-7 sm:h-7 bg-black border-2 sm:border-3 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md flex items-center justify-center">
              <ArrowLeftRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
