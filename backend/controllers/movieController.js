import Movie from '../models/movieModel.js'; 

// 1. Add Movie
export const addMovie = async (req, res) => {
    try {
        console.log("Request received to ADD movie:", req.body.title);
        const newMovie = new Movie(req.body);
        const savedMovie = await newMovie.save();
        console.log("Movie Saved Successfully:", savedMovie._id);
        res.status(201).json(savedMovie);
    } catch (error) {
        console.error("Error adding movie:", error);
        res.status(500).json(error);
    }
};

// 2. Get All Movies (with Pagination & CATEGORY Filter)
// 2. Get All Movies 
export const getMovies = async (req, res) => {
    // ... (purana code)
    const categoryFilter = req.query.category; 
    const yearFilter = req.query.year; 
    const genreFilter = req.query.genre; // 🔥 NAYI CHEEZ

    try {
        let query = {};
        if (categoryFilter) query.category = categoryFilter; 
        if (yearFilter) query.year = parseInt(yearFilter);
        
        // 🔥 JADU: Genre filtering (Case-insensitive)
        if (genreFilter) {
            query.genres = { $regex: genreFilter, $options: 'i' }; 
        }

        const movies = await Movie.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json(error);
    }
};

// 3. Search Movies 
export const searchMovies = async (req, res) => {
    // ... (purana code)
    const categoryFilter = req.query.category; 
    const yearFilter = req.query.year; 
    const genreFilter = req.query.genre; // 🔥 NAYI CHEEZ

    try {
        let dbQuery = { title: { $regex: req.query.q || '', $options: 'i' } };
        if (categoryFilter) dbQuery.category = categoryFilter;
        if (yearFilter) dbQuery.year = parseInt(yearFilter);
        
        // 🔥 Genre filtering in Search
        if (genreFilter) {
            dbQuery.genres = { $regex: genreFilter, $options: 'i' };
        }

        const movies = await Movie.find(dbQuery).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json(error);
    }
};

// 4. Get By ID
export const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json(error);
    }
};

// 5. Update Movie Details (FIXED CODE with Category)
// 5. Update Movie Details (WITH GENRES & RATING)
export const updateMovie = async (req, res) => {
    try {
        // 🔥 Yahan genres aur rating add kar diya
        const { title, posterUrl, imdbId, customUrl, year, language, category, genres, rating } = req.body;
        
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, posterUrl, imdbId, customUrl, year, language, category, genres, rating },
            { new: true } 
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        
        res.status(200).json({ message: "Movie updated successfully!", updatedMovie });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Movie update karne mein masla aagaya" });
    }
};

// 6. Delete Movie Permanently
export const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        
        if (!deletedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        
        res.status(200).json({ message: "Movie successfully deleted!" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Movie delete karne mein masla aagaya" });
    }
};