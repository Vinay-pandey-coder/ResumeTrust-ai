import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Loader from './components/UI/Loader';
import { Toaster } from 'react-hot-toast';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Analyze = lazy(() => import('./pages/Analyze'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pricing = lazy(() => import('./pages/Pricing'));

// ProtectedRoute: redirect unauthorized users to Home with login trigger
const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { user, loading, isLoggedIn, login, logout } = useAuth();
  const location = useLocation();

  // If path is /login, we show Home with openLogin prop
  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="app-wrapper flex flex-col min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          },
          duration: 4000,
        }}
      />

      <Navbar user={user} isLoggedIn={isLoggedIn} onLogout={logout} />

      <main className="flex-grow container py-8 mt-20">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home user={user} isLoggedIn={isLoggedIn} login={login} openLogin={isLoginPage} />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Home user={user} isLoggedIn={isLoggedIn} login={login} openLogin={true} />} />
            <Route path="/register" element={
              <Home user={user} isLoggedIn={isLoggedIn} login={login} openRegister={true} />
            } />

            <Route
              path="/analyze"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Analyze user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Dashboard user={user} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;