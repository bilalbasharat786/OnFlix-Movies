import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";   // ⭐ NEW

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// 🚀 GOOGLE CLIENT
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ⭐⭐⭐⭐⭐ GOOGLE LOGIN CONTROLLER (NEW)
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google Login Token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // Check User Exists
    let user = await userModel.findOne({ email });

    // If New User → Auto Create Account
    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: "", // Google users need no password
      });
    }

    // Create JWT Token
    const myToken = createToken(user._id);

    return res.json({
      success: true,
      token: myToken,
      user,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Google Login Failed" });
  }
};

// ⭐ YOUR ORIGINAL FUNCTIONS BELOW (UNTouched)

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await userModel.findOne({ email });

    if (exist) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be atleast 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      res.json({ success: true, token });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
const addToWishlist = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let wishlistData = userData.wishlist || {};

        if (wishlistData[req.body.itemId]) {
            delete wishlistData[req.body.itemId]; // Agar pehle se hai to remove kardo
        } else {
            wishlistData[req.body.itemId] = true; // Agar nahi hai to add kardo
        }

        await userModel.findByIdAndUpdate(req.body.userId, { wishlist: wishlistData });
        res.json({ success: true, message: "Wishlist Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get User Wishlist
const getUserWishlist = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        let wishlistData = userData.wishlist || {};
        res.json({ success: true, wishlistData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
export { loginUser, registerUser, adminLogin, googleLogin, addToWishlist, getUserWishlist };

