import express from 'express';
import { addMovie, getMovies, searchMovies, getMovieById, updateMovie, deleteMovie, getHeroMovies} from '../controllers/movieController.js';

const router = express.Router();

console.log("Routes Loaded...");


// Routes definitions
router.post('/add', addMovie);
router.get('/all', getMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);
router.get('/hero', getHeroMovies);

export default router;