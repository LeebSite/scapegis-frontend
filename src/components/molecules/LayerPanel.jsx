import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Eye, 
  EyeOff, 
  MoreVertical,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const LayerPanel = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [layers, setLayers] = useState([
    { id: 1, name: 'Base Map', visible: true, type: 'base' },
    { id: 2, name: 'Countries', visible: true, type: 'vector' },
    { id: 3, name: 'Cities', visible: false, type: 'point' }
  ]);

  const toggleLayerVisibility = (layerId) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  };

  return (
    <div className="bg-white border-r border-gray-200 w-80 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Layers</span>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search for an action..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Layer Categories */}
      <div className="flex-1 overflow-y-auto">
        {/* Basic Section */}
        <div className="p-4">
          <div 
            className="flex items-center gap-2 cursor-pointer mb-3"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
            <span className="text-sm font-medium text-gray-700">Basic</span>
          </div>

          {isExpanded && (
            <div className="space-y-2 ml-6">
              {/* Basic Tools Grid */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                  <div
                    key={item}
                    className="w-8 h-8 bg-gray-100 rounded border hover:bg-gray-200 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Actions</h3>
          
          {/* Vector Operations */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">Vector Operations</span>
            </div>
          </div>

          {/* Raster Operations */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">Raster Operations</span>
            </div>
          </div>

          {/* Tools & Workflows */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
              <span className="text-sm text-gray-600">Tools & Workflows</span>
            </div>
          </div>
        </div>

        {/* Import Data Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Import data from</h3>
            <span className="text-xs text-blue-600 cursor-pointer hover:underline">See all →</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">O</span>
              </div>
              <span className="text-sm text-gray-700">OpenStreet Maps</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">T</span>
              </div>
              <span className="text-sm text-gray-700">Terrain Tiles</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-green-600">S</span>
              </div>
              <span className="text-sm text-gray-700">Satellite Images</span>
            </div>
          </div>
        </div>

        {/* Current Layers */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Current Layers</h3>
          <div className="space-y-2">
            {layers.map((layer) => (
              <div key={layer.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLayerVisibility(layer.id)}
                    className="p-1"
                  >
                    {layer.visible ? (
                      <Eye className="w-4 h-4 text-gray-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <span className={`text-sm ${layer.visible ? 'text-gray-700' : 'text-gray-400'}`}>
                    {layer.name}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerPanel;
