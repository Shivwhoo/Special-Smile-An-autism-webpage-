import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkUser } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Home from './pages/Home';
import Services from './pages/Services';
import Mentor from './pages/Mentor';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="mentor" element={<Mentor />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="book" element={<BookAppointment />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          
          {/* Placeholder Routes */}
          <Route path="about" element={<ComingSoon pageName="About Us" />} />
          <Route path="faq" element={<ComingSoon pageName="FAQ" />} />
          <Route path="privacy" element={<ComingSoon pageName="Privacy Policy" />} />
          <Route path="terms" element={<ComingSoon pageName="Terms & Conditions" />} />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
