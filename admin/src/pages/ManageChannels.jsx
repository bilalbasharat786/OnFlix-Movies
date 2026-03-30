import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManageChannels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Channels fetch karna
  const fetchChannels = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/channels`);
      if (data.success) {
        setChannels(data.channels);
      }
    } catch (error) {
      toast.error("Channels load karne mein masla aya");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // Channel delete karne ka function
  const handleDelete = async (id, title) => {
    if (window.confirm(`Kya aap waqai "${title}" ko delete karna chahte hain?`)) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/channels/delete/${id}`);
        if (response.status === 200) {
          toast.success("Channel deleted! 🗑️");
          // UI se bhi channel hata dein bina page reload kiye
          setChannels(channels.filter(ch => ch._id !== id));
        }
      } catch (error) {
        toast.error("Delete karne mein error aya");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-900 p-4 md:p-8 rounded-lg shadow-lg border border-gray-700 mt-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">⚙️ Manage TV Channels</h2>
        <Link to="/admin/channels/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition">
          + Add New
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading Data...</div>
      ) : channels.length === 0 ? (
        <div className="text-center text-gray-400 py-10">Koi channel available nahi hai.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-800 text-gray-400 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Poster</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => (
                <tr key={channel._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="px-4 py-3">
                    <img src={channel.poster} alt={channel.title} className="w-12 h-12 object-cover rounded border border-gray-600" />
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{channel.title}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-700 px-2 py-1 rounded text-xs">{channel.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    {channel.status === 1 
                      ? <span className="text-green-400 font-bold text-sm">Active</span> 
                      : <span className="text-red-400 font-bold text-sm">Inactive</span>}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <Link to={`/admin/channels/edit/${channel._id}`} className="text-blue-400 hover:text-blue-300 transition">
                      Edit ✏️
                    </Link>
                    <button onClick={() => handleDelete(channel._id, channel.title)} className="text-red-500 hover:text-red-400 transition">
                      Delete 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageChannels;