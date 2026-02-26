import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    imdbId: {
      type: String,
      required: true,
    },
    customUrl: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    language: {
      type: String,
      default: "Hindi",
    },
    // 🔥 NAYI FIELD: Taa ke Hollywood aur Bollywood hamesha alag rahein
    category: {
      type: String,
      default: "Bollywood",
    },
    genres: { type: String, default: "" },
    rating: { type: String, default: "" },
  },
  { timestamps: true },
);

// === PERFORMANCE BOOSTER ===
movieSchema.index({ title: "text" }, { language_override: "none" });
console.log("Movie Schema with Indexing Created");

export default mongoose.model("Movie", movieSchema);
