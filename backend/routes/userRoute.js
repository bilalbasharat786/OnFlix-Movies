import express from "express";
import { loginUser, registerUser, adminLogin, googleLogin ,addToWishlist, getUserWishlist} from "../controllers/userController.js";
// ⭐ Auth middleware (name aapka hoga authUser ya verifyUser)
import  authUser  from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post('/add-to-wishlist', authUser, addToWishlist); 
userRouter.post('/get-wishlist', authUser, getUserWishlist);
// ⭐ NEW: Google Login Route
userRouter.post("/google-login", googleLogin);



export default userRouter;

