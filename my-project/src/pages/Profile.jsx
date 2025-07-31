import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [works, setWorks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    githubUrl: '',
    description: '',
    resume: null,
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/me');
      setUser(res.data?.data);
    } catch (err) {
      toast.error('Failed to load profile');
      console.log(err);
    }
  };

  const fetchMyWorks = async () => {
    try {
      const res = await api.get('/work/my');
      setWorks(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load works');
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyWorks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Title is required');
      return;
    }

    const data = new FormData();
    data.append('title', form.title);
    data.append('githubUrl', form.githubUrl);
    data.append('description', form.description);
    if (form.resume) {
      data.append('resume', form.resume);
    }

    try {
      await api.post('/work/create', data);
      toast.success('Work submitted!');
      setForm({ title: '', githubUrl: '', description: '', resume: null });
      fetchMyWorks(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
      console.error(err);
    }
  };

  const handleDelete = async (workId) => {
    const confirmed = window.confirm('Are you sure you want to delete this work?');
    if (!confirmed) return;

    try {
      await api.delete(`/work/${workId}`); // Based on your backend route
      toast.success('Work deleted successfully');
      fetchMyWorks(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete work');
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 space-y-10">
      {/* Profile Info */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Profile Info</h2>
        {user ? (
          <div className="space-y-2">
            <p><strong>Full Name:</strong> {user.fullname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
          </div>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>

      {/* Submit New Work */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold text-pink-700 mb-4 text-center">Submit New Work</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Work Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="url"
            name="githubUrl"
            placeholder="GitHub / LeetCode URL"
            value={form.githubUrl}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          <textarea
            name="description"
            placeholder="Short Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full"
          />
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 w-full"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Display Submitted Works */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold text-green-700 mb-4 text-center">My Submitted Works</h2>
        {works.length > 0 ? (
          <ul className="space-y-3">
            {works.map((work) => (
              <li key={work._id} className="border rounded p-3 relative">
                <h3 className="font-semibold">{work.title}</h3>
                {work.githubUrl && (
                  <p>
                    🔗 <a href={work.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">GitHub</a>
                  </p>
                )}
                {work.resumeUrl && (
                  <p>
                    📄 <a href={work.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">Resume</a>
                  </p>
                )}
                {work.description && <p>{work.description}</p>}
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(work._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No works submitted yet.</p>
        )}
      </div>
    </div>
  );
}
