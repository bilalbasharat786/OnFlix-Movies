import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddChannel = () => {
  const [channel, setChannel] = useState({
    title: '',
    poster: '',
    status: 1, // 1 for Active, 0 for Inactive
    category: 'News',
    links: {
      web: '',
      android: '',
      ios: ''
    }
  });

  const [loading, setLoading] = useState(false);

  // Normal inputs ke liye handler
  const handleChange = (e) => {
    setChannel({ ...channel, [e.target.name]: e.target.value });
  };

  // Nested links (web, android, ios) ke liye handler
  const handleLinkChange = (e) => {
    setChannel({
      ...channel,
      links: { ...channel.links, [e.target.name]: e.target.value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/channels/add`, channel);

      if (response.status === 201) {
        toast.success("TV Channel Added Successfully! 📺");
        // Form reset kar dein
        setChannel({
          title: '', poster: '', status: 1, category: 'News',
          links: { web: '', android: '', ios: '' }
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding channel ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-4 md:p-8 rounded-lg shadow-lg border border-gray-700 mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white border-b border-gray-600 pb-3">
        📺 Add New TV Channel
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Channel Title</label>
            <input type="text" name="title" required value={channel.title} onChange={handleChange} placeholder="e.g. GEO NEWS" className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Poster URL</label>
            <input type="text" name="poster" required value={channel.poster} onChange={handleChange} placeholder="http://..." className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Category</label>
            <select name="category" value={channel.category} onChange={handleChange} className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500">
              <option value="News">News</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Sports">Sports</option>
              <option value="Documentary">Documentary</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Status</label>
            <select name="status" value={channel.status} onChange={handleChange} className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500">
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border border-gray-600 rounded-lg space-y-4">
          <h3 className="text-blue-400 font-semibold mb-2">Streaming Links (m3u8)</h3>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Web Link (Required)</label>
            <input type="text" name="web" required value={channel.links.web} onChange={handleLinkChange} placeholder="http://.../playlist.m3u8" className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Android Link (Optional)</label>
              <input type="text" name="android" value={channel.links.android} onChange={handleLinkChange} className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">iOS Link (Optional)</label>
              <input type="text" name="ios" value={channel.links.ios} onChange={handleLinkChange} className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className={`w-full py-3 font-bold text-white rounded transition ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {loading ? "Saving..." : "Add TV Channel"}
        </button>
      </form>
    </div>
  );
};

export default AddChannel;