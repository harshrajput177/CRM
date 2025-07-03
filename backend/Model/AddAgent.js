// Models/AgentModel.js
const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "agent",
    },
}, { timestamps: true });

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
