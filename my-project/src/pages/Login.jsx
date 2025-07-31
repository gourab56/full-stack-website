import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, setUser } = useContext(AuthContext); // ✅ context functions
  const [form, setForm] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      password: form.password,
    };

    if (form.emailOrUsername.includes('@')) {
      payload.email = form.emailOrUsername;
    } else {
      payload.username = form.emailOrUsername;
    }

    try {
      const res = await api.post('/login', payload);
      const accessToken = res.data?.data?.accessToken;

      if (accessToken) {
        // ✅ Save token to localStorage and context
        login(accessToken);

        // ✅ Immediately fetch user and set in context
        const me = await api.get('/me');
        setUser(me.data?.data);

        alert('Login successful!');
        navigate('/profile'); // Or /dashboard if preferred
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl px-10 py-8 w-full max-w-lg space-y-6 border-2 border-pink-300"
      >
        <h2 className="text-3xl font-extrabold text-center text-pink-600">Login</h2>

        <input
          name="emailOrUsername"
          placeholder="Email or Username"
          value={form.emailOrUsername}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
