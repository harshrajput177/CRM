const express = require("express");
const {
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById
} = require("../Controller/LoginController/UserController");
const { protect } = require("../Middleware/Token");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  if (!file) return cb(null, true); // Agar file nahi hai
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(null, false); // invalid file ignore
};

const upload = multer({ storage, fileFilter });

// Public routes
router.post("/agent-login", loginUser);

// Optional image support
router.post("/register", (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.warn("❌ Multer warning:", err.message);
      req.file = null; // ignore invalid file
    }
    next();
  });
}, registerUser);

// Protected routes
router.get("/users",  getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
