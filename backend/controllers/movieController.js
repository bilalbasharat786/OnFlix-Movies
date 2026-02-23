import Movie from '../models/movieModel.js'; // Note: .js extension zaroori hai

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

// 2. Get All Movies (with Pagination)
export const getMovies = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log(`Fetching movies -> Page: ${page}, Limit: ${limit}`);

    try {
        const movies = await Movie.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        console.log(`Found ${movies.length} movies`);
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json(error);
    }
};

// 3. Search Movie (Indexed)
export const searchMovies = async (req, res) => {
    const query = req.query.q;
    console.log("Search Request for:", query);

    try {
        const movies = await Movie.find({
            $text: { $search: query }
        }).limit(10);

        console.log(`Search Found: ${movies.length} results`);
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error searching movie:", error);
        res.status(500).json(error);
    }
};
export const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json(error);
    }
};
export const updateMovie = async (req, res) => {
    try {
        const { title, url, year, category, poster } = req.body;
        
        // Movie dhoond kar naya data update karega
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, url, year, category, poster },
            { new: true } // Yeh isliye lagate hain taake update hone ke baad naya data wapis mile
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