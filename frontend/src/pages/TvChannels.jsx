import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TvChannels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/channels`);
        if (data.success) {
          // Sirf Active (status: 1) channels show karein
          const activeChannels = data.channels.filter(ch => ch.status === 1);
          setChannels(activeChannels);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-2xl md:text-4xl font-bold mb-6 border-l-4 border-red-600 pl-3">
          Live TV Channels
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : channels.length === 0 ? (
          <p className="text-gray-400 text-center text-lg mt-10">Koi channel available nahi hai.</p>
        ) : (
          /* Responsive Grid Layout */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {channels.map((channel) => (
              /* User jis channel par click karega, wo Watch page par chala jayega */
              <Link to={`/watch/channel/${channel._id}`} key={channel._id} className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                
                {/* Poster Image */}
                <div className="aspect-square w-full overflow-hidden bg-white flex items-center justify-center p-2">
                  <img 
                    src={channel.poster} 
                    alt={channel.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=No+Image" }} 
                  />
                </div>

                {/* Title & Category Area */}
                <div className="p-3 bg-gradient-to-t from-gray-900 to-gray-800">
                  <h3 className="font-semibold text-sm md:text-base text-gray-100 truncate">
                    {channel.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-red-400 font-medium bg-red-400/10 px-2 py-0.5 rounded">
                      {channel.category}
                    </span>
                    <span className="text-[10px] text-gray-400">🔴 LIVE</span>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TvChannels;