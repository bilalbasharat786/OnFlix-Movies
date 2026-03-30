import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const EditChannel = () => {
  const { id } = useParams(); // URL se channel ki ID get karega
  const navigate = useNavigate();
  
  const [channel, setChannel] = useState({
    title: '', poster: '', status: 1, category: 'News',
    links: { web: '', android: '', ios: '' }
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Component load hone par data mangwao
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/channels/${id}`);
        if (data.success) {
          setChannel(data.channel);
        }
      } catch (error) {
        toast.error("Failed to fetch channel data");
      } finally {
        setFetching(false);
      }
    };
    fetchChannelData();
  }, [id]);

  const handleChange = (e) => setChannel({ ...channel, [e.target.name]: e.target.value });
  
  const handleLinkChange = (e) => setChannel({
    ...channel, links: { ...channel.links, [e.target.name]: e.target.value }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/channels/update/${id}`, channel);
      if (response.status === 200) {
        toast.success("Channel Updated Successfully! ✏️");
        navigate('/admin/channels'); // Update hone ke baad list par wapis bhej dein (apna route adjust kar lena)
      }
    } catch (error) {
      toast.error("Error updating channel");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-white text-center mt-10">Loading Channel Data...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-4 md:p-8 rounded-lg shadow-lg border border-gray-700 mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white border-b border-gray-600 pb-3">✏️ Edit TV Channel</h2>
      
      {/* Form bilkul AddChannel jaisa hi hoga */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Channel Title</label>
            <input type="text" name="title" required value={channel.title} onChange={handleChange} className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Poster URL</label>
            <input type="text" name="poster" required value={channel.poster} onChange={handleChange} className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-green-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Category</label>
            <select name="category" value={channel.category} onChange={handleChange} className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-green-500">
              <option value="News">News</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Sports">Sports</option>
              <option value="Documentary">Documentary</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Status</label>
            <select name="status" value={channel.status} onChange={handleChange} className="w-full p-2.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-green-500">
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border border-gray-600 rounded-lg space-y-4">
          <h3 className="text-green-400 font-semibold mb-2">Streaming Links (m3u8)</h3>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Web Link</label>
            <input type="text" name="web" required value={channel.links?.web || ''} onChange={handleLinkChange} className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-green-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Android Link</label>
              <input type="text" name="android" value={channel.links?.android || ''} onChange={handleLinkChange} className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">iOS Link</label>
              <input type="text" name="ios" value={channel.links?.ios || ''} onChange={handleLinkChange} className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-green-500" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className={`w-full py-3 font-bold text-white rounded transition ${loading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'}`}>
          {loading ? "Updating..." : "Update TV Channel"}
        </button>
      </form>
    </div>
  );
};

export default EditChannel;