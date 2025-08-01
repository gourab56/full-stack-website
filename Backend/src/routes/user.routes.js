import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  createWork,
  getMyWorks,
  deleteWork
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// Register user with avatar and coverImage
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);

// Auth routes
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

// Profile
router.route("/me").get(verifyJwt, getCurrentUser);

// Work-related routes
router.route("/work/create").post(
  verifyJwt,
  upload.single("resume"),
  createWork
);

router.route("/work/my").get(
  verifyJwt,
  getMyWorks
);

// ✅ Corrected delete route with dynamic ID
router.route("/work/:id").delete(
  verifyJwt,
  deleteWork
);

export default router;
