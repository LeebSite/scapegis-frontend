import React from 'react';
import { 
  RotateCcw, 
  Maximize2, 
  Settings,
  Info,
  Layers
} from 'lucide-react';

const MapControls = () => {
  return (
    <>
      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-4">
          {/* Coordinate Display */}
          <div className="flex items-center gap-2 text-sm">
            <span>0°</span>
            <span>2500km, 5000km</span>
          </div>
          
          {/* Divider */}
          <div className="w-px h-4 bg-blue-400"></div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-blue-700 rounded transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-blue-700 rounded transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-blue-700 rounded transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-[1000] flex flex-col gap-2">
        {/* Fullscreen Toggle */}
        <button className="bg-white hover:bg-gray-50 p-3 rounded-lg shadow-lg border transition-colors">
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Layer Toggle */}
        <button className="bg-white hover:bg-gray-50 p-3 rounded-lg shadow-lg border transition-colors">
          <Layers className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Info */}
        <button className="bg-white hover:bg-gray-50 p-3 rounded-lg shadow-lg border transition-colors">
          <Info className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Scale Indicator */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="bg-white bg-opacity-90 px-3 py-2 rounded shadow-lg">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-16 h-px bg-gray-700"></div>
            <span>2500km</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapControls;
