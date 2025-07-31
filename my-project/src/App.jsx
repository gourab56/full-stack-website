import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/useAuth.js'; // make sure path is correct

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import MyWork from './pages/Mywork.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/mainLayout';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { loading } = useAuth();

  // ✅ Wait for auth check before rendering routes
  if (loading) {
    return <div className="text-center mt-10 text-pink-600 text-xl">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {/* ✅ ToastContainer added globally */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* ✅ Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/my-work" element={
            <ProtectedRoute>
              <MyWork />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
