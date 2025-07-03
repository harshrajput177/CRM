const mongoose = require('mongoose');

// Define schema
const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  email: {
    type: String,
    // required: [true, 'Email is required'],
    unique: true, // Ensures no duplicate emails
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Regex for email validation
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    match: [/^\d{10}$/, 'Mobile number must be 10 digits'], // Validates 10-digit mobile numbers
  },
  date: {
    type: Date,
    default: Date.now, // Automatically sets the current date
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create model
const Form = mongoose.model('Form', formSchema);

module.exports = Form;

