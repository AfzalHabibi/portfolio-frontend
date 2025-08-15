import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Provider } from "react-redux"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from "./store/store"
import { initializeAuth } from "./store/slices/authSlice"
import type { AppDispatch } from "./store/store"
import NavBar from "./components/NavBar"
import PublicLayout from "./components/PublicLayout"
import AdminLayoutWrapper from "./components/AdminLayoutWrapper"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/public_portfolio/Home"
import Projects from "./pages/public_portfolio/Projects"
import ProjectDetail from "./pages/public_portfolio/ProjectDetail"
import Contact from "./pages/public_portfolio/Contact"
import Login from "./pages/admin/Login"
import Dashboard from "./pages/admin/Dashboard"
import AdminProjects from "./pages/admin/Projects"
import AdminSkills from "./pages/admin/SkillsManager"
import AdminSettings from "./pages/admin/SettingsManager"

// Component to initialize auth state
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Initialize authentication state from localStorage
    dispatch(initializeAuth())
  }, [dispatch])

  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppInitializer>
          <div className="App">
          <Routes>
            {/* Public Portfolio Routes */}
            <Route
              path="/*"
              element={
                <PublicLayout>
                  <NavBar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<ProjectDetail />} />
                      <Route path="/contact" element={<Contact />} />
                    </Routes>
                  </main>
                </PublicLayout>
              }
            />
            
            {/* Admin Routes */}
            {/* Login route - no authentication required */}
            <Route path="/admin/login" element={
              <AdminLayoutWrapper>
                <Login />
              </AdminLayoutWrapper>
            } />
            
            {/* Protected Admin Routes - authentication required */}
            <Route path="/admin/dashboard" element={
              <AdminLayoutWrapper>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </AdminLayoutWrapper>
            } />
            <Route path="/admin/projects" element={
              <AdminLayoutWrapper>
                <ProtectedRoute>
                  <AdminProjects />
                </ProtectedRoute>
              </AdminLayoutWrapper>
            } />
            <Route path="/admin/skills" element={
              <AdminLayoutWrapper>
                <ProtectedRoute>
                  <AdminSkills />
                </ProtectedRoute>
              </AdminLayoutWrapper>
            } />
            <Route path="/admin/settings" element={
              <AdminLayoutWrapper>
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              </AdminLayoutWrapper>
            } />
          </Routes>
          
          {/* Toast Container for notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
        </AppInitializer>
      </Router>
    </Provider>
  )
}

export default App
