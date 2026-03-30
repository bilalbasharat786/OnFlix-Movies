import Channel from '../models/channelModel.js';

// 1. Naya Channel Add Karein (Admin ke liye)
export const addChannel = async (req, res) => {
  try {
    const { title, poster, status, links, category } = req.body;

    const newChannel = new Channel({
      title,
      poster,
      status,
      links,
      category
    });

    const savedChannel = await newChannel.save();
    res.status(201).json({ success: true, message: "Channel added successfully", channel: savedChannel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding channel", error: error.message });
  }
};

// 2. Sare Channels Get Karein (Frontend aur Admin dono ke liye)
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: channels.length, channels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching channels", error: error.message });
  }
};

// 3. Ek Single Channel Get Karein (Edit karne ya play karne ke liye)
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });
    
    res.status(200).json({ success: true, channel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching channel", error: error.message });
  }
};

// 4. Channel Update Karein (Admin Edit ke liye)
export const updateChannel = async (req, res) => {
  try {
    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    if (!updatedChannel) return res.status(404).json({ success: false, message: "Channel not found" });

    res.status(200).json({ success: true, message: "Channel updated", channel: updatedChannel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating channel", error: error.message });
  }
};

// 5. Channel Delete Karein (Admin ke liye)
export const deleteChannel = async (req, res) => {
  try {
    const deletedChannel = await Channel.findByIdAndDelete(req.params.id);
    if (!deletedChannel) return res.status(404).json({ success: false, message: "Channel not found" });

    res.status(200).json({ success: true, message: "Channel deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting channel", error: error.message });
  }
};