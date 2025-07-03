// Controller/AddAgent.js
const Admin = require("../../Model/AddAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET ,{expiresIn: '1d'});
}

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate input fields
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required." });
        }

        // Find user in database (case-insensitive email check)
        const Admin_U = await Admin.findOne({ username: username.toLowerCase() });
        if (!Admin_U) {
            return res.status(400).json({ success: false, message: "Invalid Username or password." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, Admin_U.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Username or password." });
        }

        // Generate token
        const token = createToken(Admin_U._id);
        if (!token) {
            return res.status(500).json({ success: false, message: "Error generating token." });
        }

        // Respond with success
        res.status(200).json({ 
            success: true, 
            token,
            Admin_U: {
                id: Admin_U._id,
                username: Admin_U.username,
                name: Admin_U.name // Send only non-sensitive data
            }
        });

    } 
    catch (error) {
        console.error("Login Error: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};



const registerAdmin = async (req, res) => {
    const { username, name, email, phone, password, role } = req.body;

    // Validate request
    if (!username || !email|| !name || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({ username, email, name, phone, password: hashedPassword, role });
        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


module.exports = { registerAdmin, loginAdmin };