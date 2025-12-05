import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use BrowserRouter if not already in the entry file

// Importing Components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // 💡 Import the security component

// Importing Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Summary from "./pages/Summary";
import Login from "./pages/Login";
// App.jsx

// ... (Imports from Step 1)

function App() {
  return (
    // Note: If you don't wrap the entire app in <BrowserRouter>
    // in your entry file (like main.jsx), you should wrap it here:
    // <Router>
    <>
      <div>
        <NavBar />
        <Routes>
          {/* 1. LOGIN AS HOMEPAGE: The root path (/) now points to the Login page */}
          <Route path="/" element={<Login />} />

          {/* 2. Unprotected Login Route (Still needed for direct navigation) */}
          <Route path="/login" element={<Login />} />

          {/* 3. PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <Summary />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </>
    // </Router>
  );
}

export default App;
