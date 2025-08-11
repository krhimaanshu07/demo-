import { useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudUpload, FileText, X, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { UploadResponse } from '@shared/schema';

export default function UploadCard() {
  const [, navigate] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Upload failed');
      }

      return response.json() as Promise<UploadResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      navigate(`/viewer/${data.fileId}`);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelection = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.dcm')) {
      toast({
        title: "Invalid file type",
        description: "Please select a DICOM (.dcm) file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  }, [toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, [handleFileSelection]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, [handleFileSelection]);

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="animate-slide-up">
      <CardContent className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer ${
            dragActive
              ? 'border-primary bg-blue-50 dark:bg-blue-950'
              : 'border-gray-300 dark:border-slate-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <CloudUpload className="h-16 w-16 text-gray-400 dark:text-slate-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Drop DICOM file here
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                or <span className="text-primary font-medium">click to browse</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                Supports .dcm files up to 100MB
              </p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".dcm"
          onChange={handleFileInput}
        />

        {selectedFile && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="text-primary text-xl" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="px-8 py-3 flex items-center space-x-2"
          >
            <span>
              {uploadMutation.isPending
                ? 'Uploading...'
                : selectedFile
                ? 'Upload & Analyze'
                : 'Select a file to continue'}
            </span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
