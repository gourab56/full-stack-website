import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // ✅ make sure this path is correct

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth(); // ✅ get token and logout from context

  const handleLogout = () => {
    logout(); // clear context and token
    navigate('/login');
  };

  return (
    <nav className="bg-pink-100 shadow-md py-4 px-8 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-pink-700 hover:text-pink-900">
        SKILL
      </Link>

      <div className="flex items-center space-x-6 text-pink-700 font-medium">
        <Link to="/" className="hover:text-pink-900">Home</Link>

        {token ? (
          <>
            <Link to="/dashboard" className="hover:text-pink-900">Dashboard</Link>
            <Link to="/profile" className="hover:text-pink-900">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-pink-900">Login</Link>
            <Link to="/register" className="hover:text-pink-900">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
