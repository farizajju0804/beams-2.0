import React from 'react';
import { Viewer, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
// Import the styles provided by the react-pdf-viewer packages
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
interface ArticleProps {
  articleUrl: string | undefined; 
}

const Article: React.FC<ArticleProps> = ({ articleUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const isMobile = window.innerWidth < 767
  if (!articleUrl) {
    return (
      <div className="my-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold my-2">Article</h2>
        <p className="text-lg text-gray-800">No article available</p>
      </div>
    );
  }

  return (
    <div className="my-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold my-2">Article</h2>
      <div style={{ height: '750px' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={articleUrl}
            defaultScale={ isMobile ? SpecialZoomLevel.PageFit : 1.0}
            // plugins={[defaultLayoutPluginInstance]}
          />
         
        </Worker>
      </div>
    </div>
  );
};

export default Article;


// 'use client'; // Necessary for using client-side hooks and components

// import React, { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';


// // Set up the worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// interface ArticleProps {
//   articleUrl: string | undefined;
// }

// const Article: React.FC<ArticleProps> = ({ articleUrl }) => {

//   const [numPages, setNumPages] = useState<number | null>(null);

//   if (!articleUrl) {
//     return (
//       <div className="my-8 p-4 bg-gray-100 rounded-lg">
//         <h2 className="text-2xl font-bold my-2">Article</h2>
//         <p className="text-lg text-gray-800">No article available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="my-8 p-4 bg-gray-100 rounded-lg">
//       <h2 className="text-2xl font-bold my-2">Article</h2>
//       <div style={{ height: '750px' }}>
//         <Document
//           file={articleUrl}
//           onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//           loading={<div>Loading PDF...</div>}
//         >
//           {Array.from(new Array(numPages), (el, index) => (
//             <Page
//               key={`page_${index + 1}`}
//               pageNumber={index + 1}
//               scale={1.0}
//               renderAnnotationLayer
//               renderTextLayer
//             />
//           ))}
//         </Document>
//       </div>
//     </div>
//   );
// };

// export default Article;
