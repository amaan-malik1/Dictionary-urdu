import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ROUTES } from './constants/routes'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Dictionary from './components/Dictionary'
import WordDetails from './components/WordDetails'
import Bookmarks from './components/Bookmarks'
import NotFound from './components/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './components/Login'
import SignUp from './components/SignUp'
import PrivateRoute from './components/PrivateRoute'
import { useEffect, useState } from 'react'
import { getPerformance } from 'firebase/performance'
import { analytics } from './firebase/config'
import { logEvent } from 'firebase/analytics'
import TestConnection from './components/TestConnection'

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null, errorInfo: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught by boundary:", error, errorInfo);
//     this.setState({ error, errorInfo });
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ padding: '20px', textAlign: 'center' }}>
//           <h1>Something went wrong.</h1>
//           <p>{this.state.error && this.state.error.toString()}</p>
//           <button onClick={() => window.location.reload()}>
//             Reload Page
//           </button>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

function App() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log("App is initializing...");
      // Add initialization check
      // Initialize performance monitoring safely
      const perf = getPerformance()
      if (perf && typeof perf.trace === 'function') {
        const pageLoadTrace = perf.trace('page_load')
        pageLoadTrace.start()

        window.onload = () => {
          pageLoadTrace.stop()
        }
      } else {
        console.log("Performance monitoring not fully available")
      }

      // Log page view if analytics is available
      if (analytics) {
        logEvent(analytics, 'page_view')
      }

      console.log("App initialized successfully");
      setInitialized(true);
    } catch (e) {
      console.error("Error in initialization:", e);
      setError(e.toString());
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Error Loading App</h1>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <TestConnection />
      {initialized ? (
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dictionary" element={<Dictionary />} />
                <Route path="/word/:id" element={<WordDetails />} />
                <Route
                  path={ROUTES.BOOKMARKS}
                  element={
                    <PrivateRoute>
                      <Bookmarks />
                    </PrivateRoute>
                  }
                />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGNUP} element={<SignUp />} />
                <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      ) : (
        <div>Loading application...</div>
      )}
    </ErrorBoundary>
  )
}

export default App
