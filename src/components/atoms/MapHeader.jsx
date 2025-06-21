import React from 'react';
import { ArrowLeft, Share2, MoreVertical, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapHeader = ({ projectName = "Untitled Project" }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between border-b border-slate-700">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold">S</span>
          </div>
          <div>
            <h1 className="font-medium text-lg">{projectName}</h1>
          </div>
        </div>
      </div>

      {/* Center Section - Project Info */}
      <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>14 days left</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>1 collaborator</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
          Share
        </button>
        
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MapHeader;
