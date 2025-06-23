import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage, Dashboard, ProjectEditor, IntegrationTest, Login, Register } from './pages';
import { ProtectedRoute } from './components/molecules';
import DevPanel from './components/molecules/DevPanel';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:projectId" element={<ProjectEditor />} />
        <Route path="/test" element={<IntegrationTest />} />
      </Routes>

      {/* Development Panel - only shows in development */}
      <DevPanel />
    </Router>
  );
}

export default App;
