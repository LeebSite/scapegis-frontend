import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage, Dashboard, ProjectEditor, IntegrationTest, Login, Register, EmailVerification, ForgotPassword } from './pages';
import { ProtectedRoute } from './components/molecules';
import DevPanel from './components/molecules/DevPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectEditor />
            </ProtectedRoute>
          }
        />

        {/* Development/Test routes */}
        <Route path="/test" element={<IntegrationTest />} />
      </Routes>

      {/* Development Panel - only shows in development */}
      <DevPanel />
    </Router>
  );
}

export default App;
