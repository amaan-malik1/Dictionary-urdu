import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ROUTES } from './constants/routes'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Dictionary from './components/Dictionary'
import Defination from './components/Defination'
import Bookmarks from './components/Bookmarks'
import NotFound from './components/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './components/Login'
import SignUp from './components/SignUp'
import PrivateRoute from './components/PrivateRoute'
import { useEffect } from 'react'
import { getPerformance } from 'firebase/performance'
import { analytics } from './firebase/config'
import { logEvent } from 'firebase/analytics'
import SystemCheck from './components/SystemCheck'

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    const perf = getPerformance()

    // Monitor page load time
    const pageLoadTrace = perf.trace('page_load')
    pageLoadTrace.start()

    window.onload = () => {
      pageLoadTrace.stop()
    }

    // Log page view
    logEvent(analytics, 'page_view')
  }, [])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.DICTIONARY} element={<Dictionary />} />
                <Route path="/word/:word" element={<Defination />} />
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
            {process.env.NODE_ENV === 'development' && <SystemCheck />}
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
