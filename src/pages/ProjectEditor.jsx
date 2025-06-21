import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../stores/projectStore';
import MapHeader from '../components/atoms/MapHeader';
import MapToolbar from '../components/atoms/MapToolbar';
import LayerPanel from '../components/molecules/LayerPanel';
import MapContainer from '../components/organisms/MapContainer';
import MapControls from '../components/organisms/MapControls';

const ProjectEditor = () => {
  const { projectId } = useParams();
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);

  const {
    currentProject,
    isLoading,
    createNewProject,
    loadProject
  } = useProjectStore();

  useEffect(() => {
    if (projectId === 'new') {
      // Create new project
      const newProject = createNewProject('Untitled Project');
      console.log('Created new project:', newProject);
    } else {
      // Load existing project
      loadProject(projectId);
    }
  }, [projectId, createNewProject, loadProject]);

  const toggleLayerPanel = () => {
    setIsLayerPanelOpen(!isLayerPanelOpen);
  };

  if (isLoading || !currentProject) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <MapHeader projectName={currentProject.name} />
      
      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Layer Panel */}
        <div className={`
          transition-all duration-300 ease-in-out
          ${isLayerPanelOpen ? 'w-80' : 'w-0'}
          ${isLayerPanelOpen ? 'opacity-100' : 'opacity-0'}
          overflow-hidden
        `}>
          <LayerPanel />
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Map Container */}
          <MapContainer />
          
          {/* Map Toolbar */}
          <MapToolbar />
          
          {/* Map Controls */}
          <MapControls />
          
          {/* Layer Panel Toggle Button */}
          <button
            onClick={toggleLayerPanel}
            className={`
              absolute top-4 z-[1001] bg-white hover:bg-gray-50 p-2 rounded-lg shadow-lg border transition-all duration-300
              ${isLayerPanelOpen ? 'left-[320px]' : 'left-4'}
            `}
          >
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isLayerPanelOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
