import React from 'react';
import { 
  Search, 
  Edit3, 
  Camera, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Settings,
  Share2,
  Download
} from 'lucide-react';

const MapToolbar = () => {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      {/* Search Tool */}
      <div className="bg-white rounded-lg shadow-lg p-2 border">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Drawing Tools */}
      <div className="bg-white rounded-lg shadow-lg p-2 border flex flex-col gap-1">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Edit3 className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Camera className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-lg p-2 border flex flex-col gap-1">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <ZoomIn className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <ZoomOut className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <RotateCcw className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default MapToolbar;
