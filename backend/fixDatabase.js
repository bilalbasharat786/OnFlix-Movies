const mongoose = require('mongoose');
const axios = require('axios');

// 🔴 APNI MONGODB URI YAHAN DALO
const MONGO_URI = "mongodb+srv://loginandregister:bilal%40123@cluster0.zzh8so0.mongodb.net/test?retryWrites=true&w=majority";

// 🔥 APNI DONO OMDB KEYS YAHAN DALO
const OMDB_KEYS = [
    "5dbcf12c", // Tumhari pehli key
    "519ce6b7"  // Doosri key
];

// Tumhara Movie Model (Schema)
const movieSchema = new mongoose.Schema({
    title: String,
    imdbId: String,
    year: Number,
    rating: String, // 🆕 Rating field add kar di (Strict false hai to wese bhi masla nahi)
}, { strict: false });

const Movie = mongoose.model('Movie', movieSchema);

// Har request ke beech mein thora waqfa dene ke liye function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fixMoviesData = async () => {
    try {
        console.log("⏳ Database se connect ho raha hoon...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Database Connected!");

        // Saari movies database se mangwao
        const allMovies = await Movie.find({});
        console.log(`🚀 Total Movies mili hain: ${allMovies.length}`);

        let successCount = 0;
        let failCount = 0;
        let currentKeyIndex = 0;

        for (let i = 0; i < allMovies.length; i++) {
            const movie = allMovies[i];

            if (!movie.imdbId) {
                console.log(`⚠️ Movie skip ki (IMDB ID nahi hai): ${movie.title}`);
                continue;
            }

            // 🔥 1000 movies ke baad API Key switch karne ka logic
            if (i === 1000) {
                console.log("🔄 Pehli API Key ki limit poori ho gayi! Doosri Key par switch kar raha hoon...");
                currentKeyIndex = 1;
            }

            const currentApiKey = OMDB_KEYS[currentKeyIndex];
            const omdbUrl = `https://www.omdbapi.com/?i=${movie.imdbId}&apikey=${currentApiKey}`;

            try {
                const omdbRes = await axios.get(omdbUrl);
                
                if (omdbRes.data && omdbRes.data.Response === "True") {
                    const exactTitle = omdbRes.data.Title;
                    const exactYear = parseInt(omdbRes.data.Year) || movie.year;
                    const exactRating = omdbRes.data.imdbRating; // 🆕 OMDb se rating uthai

                    // MongoDB mein movie ko update karo
                    await Movie.updateOne(
                        { _id: movie._id },
                        { 
                            $set: { 
                                title: exactTitle, 
                                year: exactYear,
                                rating: exactRating // 🆕 Database mein rating save kar di
                            } 
                        }
                    );

                    successCount++;
                    console.log(`✅ [${i + 1}/${allMovies.length}] Updated: ${exactTitle} (${exactYear}) - Rating: ${exactRating}`);
                } else {
                    failCount++;
                    console.log(`❌ [${i + 1}/${allMovies.length}] OMDb par nahi mili: ${movie.title}`);
                }
            } catch (err) {
                failCount++;
                console.log(`❌ Error aya ${movie.imdbId} par:`, err.message);
            }

            // API rate limit se bachne ke liye 500ms ka wait
            await sleep(500); 
        }

        console.log("=====================================");
        console.log(`🎉 MISSION SUCCESSFUL!`);
        console.log(`✅ Theek huin: ${successCount}`);
        console.log(`❌ Fail huin: ${failCount}`);
        console.log("=====================================");
        process.exit(0);

    } catch (error) {
        console.error("Bara Masla Aya:", error);
        process.exit(1);
    }
};

fixMoviesData();