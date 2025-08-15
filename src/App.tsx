import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Provider } from "react-redux"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from "./store/store"
import NavBar from "./components/NavBar"
import PublicLayout from "./components/PublicLayout"
import AdminLayoutWrapper from "./components/AdminLayoutWrapper"
import Home from "./pages/public_portfolio/Home"
import Projects from "./pages/public_portfolio/Projects"
import ProjectDetail from "./pages/public_portfolio/ProjectDetail"
import Contact from "./pages/public_portfolio/Contact"
import Login from "./pages/admin/Login"
import Dashboard from "./pages/admin/Dashboard"
import AdminProjects from "./pages/admin/Projects"
import AdminSkills from "./pages/admin/SkillsManager"
import AdminSettings from "./pages/admin/SettingsManager"

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
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
            <Route path="/admin/login" element={<AdminLayoutWrapper><Login /></AdminLayoutWrapper>} />
            <Route path="/admin/dashboard" element={<AdminLayoutWrapper><Dashboard /></AdminLayoutWrapper>} />
            <Route path="/admin/projects" element={<AdminLayoutWrapper><AdminProjects /></AdminLayoutWrapper>} />
            <Route path="/admin/skills" element={<AdminLayoutWrapper><AdminSkills /></AdminLayoutWrapper>} />
            <Route path="/admin/settings" element={<AdminLayoutWrapper><AdminSettings /></AdminLayoutWrapper>} />
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
      </Router>
    </Provider>
  )
}

export default App
