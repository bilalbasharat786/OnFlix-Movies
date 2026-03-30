import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';

const TvPlayer = () => {
  const { id } = useParams(); // URL se channel ki ID fetch karega
  const navigate = useNavigate();
  
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/channels/${id}`);
        if (data.success) {
          setChannel(data.channel);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching channel:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-white flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Channel Not Found ❌</h2>
        <button onClick={() => navigate('/live-tv')} className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700 transition">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/live-tv')}
          className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 transition"
        >
          <span>←</span> Back to Channels
        </button>

        {/* Video Player Section */}
        <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative group">
          
          {/* Responsive Player Wrapper (16:9 Aspect Ratio) */}
          <div className="relative w-full aspect-video">
            <ReactPlayer
              url={channel.links?.web} // Apke database se m3u8 link
              playing={true} // Auto-play
              controls={true} // Volume, Fullscreen, Play/Pause controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              config={{
                file: {
                  forceHLS: true, // Force karta hai m3u8 format ko chalane ke liye
                }
              }}
            />
          </div>
        </div>

        {/* Channel Information Section */}
        <div className="mt-6 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center">
          
          {/* Channel Logo/Poster */}
          <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 p-2 flex items-center justify-center">
            <img 
              src={channel.poster} 
              alt={channel.title} 
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Logo" }}
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{channel.title}</h1>
              <span className="bg-red-600 text-white text-[10px] md:text-xs px-2 py-1 rounded font-bold tracking-wider animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full inline-block"></span> LIVE
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                {channel.category}
              </span>
              <span>👁️ {channel.views ? channel.views.toLocaleString() : '0'} watching</span>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default TvPlayer;