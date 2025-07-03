// Controller/AddAgent.js
const Agent = require("../../Model/AddAgent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET ,{expiresIn: '1d'});
};

const loginAgent = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate input fields
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required." });
        }

        // Find user in database (case-insensitive email check)
        const Agent_U = await Agent.findOne({ username: username.toLowerCase() });
        if (!Agent_U) {
            return res.status(400).json({ success: false, message: "Invalid Username or password." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, Agent_U.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid username or password." });
        }

        // Generate token
        const token = createToken(Agent_U._id);
        if (!token) {
            return res.status(500).json({ success: false, message: "Error generating token." });
        }

        // Respond with success
        res.status(200).json({ 
            success: true, 
            token,
            Agent_U: {
                id: Agent_U._id,
                username: Agent_U.username,
                name: Agent_U.name // Send only non-sensitive data
            }
        });

    } catch (error) {
        console.error("Login Error: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};



const registerAgent = async (req, res) => {
    const { username, name, phone, password, role } = req.body;

    // Validate request
    if (!username || !name || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if username already exists
        const existingAgent = await Agent.findOne({ username });
        if (existingAgent) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new agent
        const newAgent = new Agent({ username, name, phone, password: hashedPassword, role });
        await newAgent.save();
        res.status(201).json({ message: "Agent registered successfully" });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

module.exports = { registerAgent, loginAgent };