
import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import WorkCard from '../components/Workcard.jsx';

const MyWork = () => {
  const [formData, setFormData] = useState({
    title: '',
    githubUrl: '',
    description: '',
    resume: null,
  });

  const [works, setWorks] = useState([]);

  const fetchWorks = async () => {
    try {
      const res = await api.get('/work/my');
      setWorks(res.data.data);
    } catch (err) {
      toast.error(err,'Failed to fetch work');
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.githubUrl || !formData.description || !formData.resume) {
      toast.error('All fields are required');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('githubUrl', formData.githubUrl);
    data.append('description', formData.description);
    data.append('resume', formData.resume);

    try {
      await api.post('/work/create', data);
      toast.success('Work uploaded successfully');
      setFormData({ title: '', githubUrl: '', description: '', resume: null });
      fetchWorks(); // Refresh work list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Your Work</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
        />
        <input type="file" onChange={handleFileChange} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Work
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Your Submitted Works</h3>
      <div className="grid gap-4">
        {works.length > 0 ? (
          works.map((work) => <WorkCard key={work._id} work={work} />)
        ) : (
          <p className="text-gray-600">No work uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyWork;
