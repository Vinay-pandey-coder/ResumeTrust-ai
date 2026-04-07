import React, { Suspense, lazy, useEffect } from 'react'; // useEffect add kiya
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ReactGA from "react-ga4"; // Google Analytics import
import useAuth from './hooks/useAuth';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Loader from './components/UI/Loader';
import { Toaster } from 'react-hot-toast';

// Google Analytics Initialize (Tumhari ID)
const TRACKING_ID = "G-6YP6JNQDH0"; 
ReactGA.initialize(TRACKING_ID);

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Analyze = lazy(() => import('./pages/Analyze'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));

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

  // --- Google Analytics Tracking Logic ---
  useEffect(() => {
    // Jab bhi URL change hoga (location.pathname), GA ko signal jayega
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.search 
    });
  }, [location]); 
  // ----------------------------------------

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
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

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