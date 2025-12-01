const { User } = require("../../Model/Login-Ag-Ad");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    // Extract data from body
    const { userId, name, password, role, phone } = req.body; // <-- changed username -> userId
    const image = req.file ? req.file.filename : null;

    if (!userId || !name || !password) {
      return res.status(400).json({ message: "Required fields missing ❌" });
    }

    // check if user already exists by userId
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "UserId already exists ❌" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      userId,
      name,
      password: hashedPassword,
      role: role || "user",
      phone,
      image,
    });

    res.status(201).json({
      message: "User registered ✅",
      user: {
        id: newUser._id,
        userId: newUser.userId,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
};



const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;
    console.log("Login attempt:", userId, password); // ✅ check kya aa raha frontend se

    const user = await User.findOne({ userId });
    console.log("User from DB:", user); // ✅ check kya DB me hai

    if (!user) return res.status(400).json({ message: "User not found ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // ✅ check match

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials ❌" });



    // ✅ generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        image: user.image,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ✅ Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
};



const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, role, image, phone } = req.body;

    let updateData = { name, role, image, phone };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "User not found ❌" });

    res.status(200).json({ message: "User updated successfully ✅", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error ❌", error: err.message });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById
};

