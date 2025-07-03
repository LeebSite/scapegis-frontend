import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage, Dashboard, ProjectEditor, IntegrationTest, Login, Register, EmailVerification, ForgotPassword, AuthCallback, AuthError } from './pages';
import OAuthTest from './pages/OAuthTest';
import OAuthDebug from './pages/OAuthDebug';
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
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/error" element={<AuthError />} />

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
        <Route path="/oauth-test" element={<OAuthTest />} />
        <Route path="/oauth-debug" element={<OAuthDebug />} />
      </Routes>

      {/* Development Panel - only shows in development */}
      <DevPanel />
    </Router>
  );
}

export default App;
