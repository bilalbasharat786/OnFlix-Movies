import express from 'express';
import {
  addChannel,
  getAllChannels,
  getChannelById,
  updateChannel,
  deleteChannel
} from '../controllers/channelController.js'; // .js extension zaroori hai

const router = express.Router();

// Define Routes
router.post('/add', addChannel);
router.get('/', getAllChannels);
router.get('/:id', getChannelById);
router.put('/update/:id', updateChannel);
router.delete('/delete/:id', deleteChannel);

export default router;