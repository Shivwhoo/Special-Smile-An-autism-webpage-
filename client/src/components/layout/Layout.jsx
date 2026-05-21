import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';
import CalmCompass from './CalmCompass';
import BreathingCompanion from './BreathingCompanion';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
      <CalmCompass />
      <BreathingCompanion />
    </div>
  );
};

export default Layout;
