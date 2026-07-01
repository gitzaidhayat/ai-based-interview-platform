import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import HomePage from './components/HomePageNew.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import InterviewRoom from './components/Interview/InterviewRoom.jsx';
import Results from './components/Interview/Results.jsx';
import CandidateInterview from './components/Interview/CandidateInterview.jsx';
import RecruiterDashboard from './components/Recruiter/RecruiterDashboard.jsx';
import RecruiterCreateInterview from './components/Recruiter/RecruiterCreateInterview.jsx';
import RecruiterAnalysis from './components/Recruiter/RecruiterAnalysis.jsx';
import RecruiterCandidates from './components/Recruiter/RecruiterCandidates.jsx';
import RecruiterSettings from './components/Recruiter/RecruiterSettings.jsx';
import { AboutPage, PricingPage, ContactPage } from './components/PublicPages.jsx';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return !user ? children : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {user?.role === 'recruiter' ? <Navigate to="/recruiter/dashboard" /> : <Dashboard />}
        </ProtectedRoute>
      } />
      <Route path="/interview/:id" element={<CandidateInterview />} />
      <Route path="/candidate-interview/:id" element={<CandidateInterview />} />
      <Route path="/interview-room/:id" element={
        <ProtectedRoute>
          <InterviewRoom />
        </ProtectedRoute>
      } />
      <Route path="/results/:id" element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/dashboard" element={
        <ProtectedRoute>
          <RecruiterDashboard />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/create-interview" element={
        <ProtectedRoute>
          <RecruiterCreateInterview />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/analysis" element={
        <ProtectedRoute>
          <RecruiterAnalysis />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/candidates" element={
        <ProtectedRoute>
          <RecruiterCandidates />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/settings" element={
        <ProtectedRoute>
          <RecruiterSettings />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
