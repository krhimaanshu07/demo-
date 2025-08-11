import UploadCard from '@/components/upload-card';

export default function Upload() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload DICOM File</h2>
        <p className="text-gray-600 dark:text-gray-400">Select or drag & drop your DICOM file to begin analysis</p>
      </div>
      <UploadCard />
    </div>
  );
}
