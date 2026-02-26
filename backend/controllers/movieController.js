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
export const getMovies = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const categoryFilter = req.query.category; 
    const yearFilter = req.query.year; // 🔥 NAYI CHEEZ: Frontend se aane wala saal

    try {
        let query = {};
        if (categoryFilter) {
            query.category = categoryFilter; 
        }
        // 🔥 JADU: Agar saal select hua hai, to Database mein sirf wahi saal dhoondo
        if (yearFilter) {
            query.year = parseInt(yearFilter);
        }

        const movies = await Movie.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json(error);
    }
};

// 3. Search Movie (with CATEGORY Filter)
export const searchMovies = async (req, res) => {
    const query = req.query.q || ''; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const categoryFilter = req.query.category; 
    const yearFilter = req.query.year; // 🔥 NAYI CHEEZ

    try {
        let dbQuery = { title: { $regex: query, $options: 'i' } };
        
        if (categoryFilter) {
            dbQuery.category = categoryFilter;
        }
        // 🔥 Search mein bhi year filter laga diya
        if (yearFilter) {
            dbQuery.year = parseInt(yearFilter);
        }

        const movies = await Movie.find(dbQuery)
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        res.status(200).json(movies);
    } catch (error) {
        console.error("Error searching movie:", error);
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
export const updateMovie = async (req, res) => {
    try {
        // Yahan category bhi add kardi hai
        const { title, posterUrl, imdbId, customUrl, description, year, language, category } = req.body;
        
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, posterUrl, imdbId, customUrl, description, year, language, category },
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