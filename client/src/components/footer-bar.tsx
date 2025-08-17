import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Download, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProcessResponse } from "@shared/schema";

interface FooterBarProps {
  type: "process" | "download";
  fileId: string;
  resultId?: string;
  onProcess?: () => void;
}

export function FooterBar({
  type,
  fileId,
  resultId,
  onProcess,
}: FooterBarProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const processMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/process/${fileId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Processing failed");
      }

      return response.json() as Promise<ProcessResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "AI enhancement completed",
      });
      navigate(`/compare/${fileId}/${data.resultId}`);
    },
    onError: (error) => {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProcess = () => {
    processMutation.mutate(fileId);
    onProcess?.();
  };

  const handleDownload = async (downloadFileId: string, filename: string) => {
    try {
      const response = await fetch(`/api/download/${downloadFileId}`);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: `Downloading ${filename}...`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  if (type === "process") {
    return (
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Bot className="text-primary w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  GenAI DR Processing
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Enhance image quality using artificial intelligence
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleProcess}
              disabled={processMutation.isPending}
              className="px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center space-x-2 w-full sm:w-auto"
              size="sm"
            >
              <Bot className="w-4 h-4" />
              <span className="text-sm">
                {processMutation.isPending
                  ? "Processing..."
                  : "Convert to GenAI DR"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Download className="text-primary w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                Download Options
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                Save the enhanced DICOM image
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto ">
            <Button
              variant="outline"
              onClick={() => handleDownload(fileId, "CR.dcm")}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              size="sm"
            >
              <FileDown className="w-4 h-4" />
              <span className="text-sm">CR</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownload(resultId!, "GenAI DR.dcm")}
              disabled={!resultId}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              size="sm"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">GenAI DR</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
