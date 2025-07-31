import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
