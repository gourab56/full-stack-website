import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get('/me');
        setUser(res.data.data);
      } catch (err) {
        console.error('Not authenticated, redirecting...');
        navigate('/login');
        console.log(err)
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-700 text-xl font-medium">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-pink-100 px-8 py-6 border-b border-pink-200">
          <h1 className="text-5xl font-extrabold text-pink-600 tracking-tight mb-2">
            Welcome, {user.fullname} 🎉
          </h1>
          <p className="text-pink-700 text-lg font-medium">Glad to see you here!</p>
        </div>

        {/* User Info Section */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 uppercase">Username</p>
              <p className="text-lg font-semibold text-pink-800">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Email</p>
              <p className="text-lg font-semibold text-pink-800">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-pink-600 font-semibold mb-1">Avatar</p>
              <img
                src={user.avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 border-pink-400 shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
            {user.coverImage && (
              <div className="text-center">
                <p className="text-sm text-pink-600 font-semibold mb-1">Cover Image</p>
                <img
                  src={user.coverImage}
                  alt="cover"
                  className="w-48 h-24 object-cover rounded-xl border border-pink-300 shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer / Additional Actions */}
        <div className="px-8 py-4 bg-pink-50 border-t border-pink-200 text-right">
          <p className="text-sm text-pink-500">✨ Keep exploring and building your dream!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
