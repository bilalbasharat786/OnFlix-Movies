import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    posterUrl: {
        type: String,
        required: true
    },
    imdbId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    year: {
        type: Number,
        default: new Date().getFullYear()
    },
    language: {
        type: String,
        default: "Hindi"
    }
}, { timestamps: true });

// === PERFORMANCE BOOSTER ===
// Text Index for Fast Search
// { language_override: 'none' } ka matlab hai ke meri 'language' field ko mat chhero
movieSchema.index({ title: 'text' }, { language_override: 'none' });
console.log("Movie Schema with Indexing Created");

export default mongoose.model('Movie', movieSchema);