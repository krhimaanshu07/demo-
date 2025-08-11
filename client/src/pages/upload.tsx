import UploadCard from '@/components/upload-card';

export default function Upload() {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Upload DICOM File
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
              Select or drag & drop your DICOM file to begin analysis
            </p>
          </div>
          <UploadCard />
        </div>
      </div>
    </div>
  );
}
