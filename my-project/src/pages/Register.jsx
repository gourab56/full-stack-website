import { useState } from 'react';
import api from '../services/api';
import InputField from '../components/InputField';
import FileUpload from '../components/FileUpload';
import AvatarPreview from '../components/AvatarPreview';

const Register = () => {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' || name === 'coverImage') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) {
      data.append(key, form[key]);
    }

    try {
      const res = await api.post('/register', data);
      alert('User registered!');
      console.log(res.data);
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl px-10 py-8 w-full max-w-lg space-y-6 border-2 border-pink-300"
      >
        <h2 className="text-3xl font-extrabold text-center text-pink-600">Create an Account</h2>

        <InputField
          name="fullname"
          label="Full Name"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          required
        />
        <InputField
          name="email"
          label="Email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <InputField
          name="username"
          label="Username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <FileUpload
          name="avatar"
          label="Avatar"
          onChange={handleChange}
          required
        />
        <AvatarPreview file={form.avatar} />

        <FileUpload
          name="coverImage"
          label="Cover Image"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
