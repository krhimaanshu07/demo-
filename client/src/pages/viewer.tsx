import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { DicomViewport } from "@/components/dicom-viewport";
import { DicomInfoPanel } from "@/components/dicom-info-panel";
import { FooterBar } from "@/components/footer-bar";
import { DicomFileInfo } from "@/types/dicom";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Viewer() {
  const { fileId } = useParams<{ fileId: string }>();

  const {
    data: fileInfo,
    isLoading,
    error,
  } = useQuery<DicomFileInfo>({
    queryKey: ["/api/file", fileId],
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              File Not Found
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            The requested DICOM file could not be found. Please check the URL or
            upload a new file.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 w-full px-2 sm:px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 order-1">
              <div className="h-[50vh] sm:h-[60vh] lg:h-[calc(100vh-280px)]">
                <DicomViewport fileInfo={fileInfo} />
              </div>
            </div>

            <div className="lg:col-span-1 order-2">
              <div className="h-[40vh] sm:h-[50vh] lg:h-[calc(100vh-280px)]">
                <DicomInfoPanel fileInfo={fileInfo} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          <FooterBar
            type="process"
            fileId={fileId!}
            onProcess={() => {
              // Navigation will be handled by the FooterBar component
            }}
          />
        </div>
      </div>
    </div>
  );
}

// import { useParams } from "wouter";
// import { useQuery } from "@tanstack/react-query";
// import { DicomViewport } from "@/components/dicom-viewport";
// import { DicomInfoPanel } from "@/components/dicom-info-panel";
// import { FooterBar } from "@/components/footer-bar";
// import { DicomFileInfo } from "@/types/dicom";
// import { Card } from "@/components/ui/card";
// import { AlertCircle } from "lucide-react";

// export default function Viewer() {
//   const { fileId } = useParams<{ fileId: string }>();

//   const {
//     data: fileInfo,
//     isLoading,
//     error,
//   } = useQuery<DicomFileInfo>({
//     queryKey: ["/api/file", fileId],
//     enabled: !!fileId,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-dvh">
//         <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
//       </div>
//     );
//   }

//   if (error || !fileInfo) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-12">
//         <Card className="p-6">
//           <div className="flex items-center space-x-3 mb-4">
//             <AlertCircle className="h-8 w-8 text-red-500" />
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//               File Not Found
//             </h2>
//           </div>
//           <p className="text-gray-600 dark:text-gray-400">
//             The requested DICOM file could not be found. Please check the URL or
//             upload a new file.
//           </p>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-dvh flex flex-col">
//       {/* MAIN:
//           - Small screens: scroll page (overflow-y-auto)
//           - Large/NestHub/NestHubMax: lock to one screen (overflow-hidden)
//       */}
//       <main
//         className="
//           flex-1 w-full px-2 sm:px-4 py-3 sm:py-4
//           overflow-y-auto
//           lg:overflow-hidden nh:overflow-hidden nhmax:overflow-hidden
//         "
//       >
//         <div className="max-w-7xl mx-auto h-full flex flex-col">
//           {/* GRID HEIGHT BUDGET:
//              - Small screens: natural flow (h-auto)
//              - Large/NestHub/NestHubMax: fill viewport minus reserved footer/header space
//                (adjust 220px if your footer/header is taller/shorter)
//           */}
//           <div
//             className="
//               grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6
//               h-auto
//               lg:h-[calc(100dvh-220px)] nh:h-[calc(100dvh-220px)] nhmax:h-[calc(100dvh-220px)]
//             "
//           >
//             {/* VIEWPORT (2/3) */}
//             <section className="lg:col-span-2 min-h-[360px] lg:min-h-0">
//               <div className="h-[50svh] sm:h-[55svh] lg:h-full nh:h-full nhmax:h-full rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur overflow-hidden">
//                 <DicomViewport fileInfo={fileInfo} />
//               </div>
//             </section>

//             {/* INFO (1/3) */}
//             <aside className="lg:col-span-1 min-h-[280px] lg:min-h-0">
//               <div className="h-[40svh] sm:h-[45svh] lg:h-full nh:h-full nhmax:h-full rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur overflow-auto">
//                 <DicomInfoPanel fileInfo={fileInfo} />
//               </div>
//             </aside>
//           </div>
//         </div>
//       </main>

//       {/* FOOTER:
//           Keep compact spacing; sits right after the grid on one screen for lg/nh/nhmax.
//       */}
//       <footer className="w-full px-2 sm:px-4 py-3 sm:py-4">
//         <div className="max-w-7xl mx-auto">
//           <FooterBar
//             type="process"
//             fileId={fileId!}
//             onProcess={() => {
//               /* navigation handled inside FooterBar */
//             }}
//           />
//         </div>
//       </footer>
//     </div>
//   );
// }
