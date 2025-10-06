import { Download } from "lucide-react";
import React from "react";

function DownloadButton({ filename }) {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${API_URL}/download/${filename}`; // رابط من Laravel
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button 
      onClick={handleDownload} 
      className="px-4 py-2 bg-blue-600 z-50 text-white rounded-lg"
    >
       <Download/>
    </button>
  );
}

export default DownloadButton;
