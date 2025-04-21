const mongoose = require('mongoose');

// Create a schema for the School
const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // name is required
        trim: true       // removes any extra spaces before and after the string
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    logo: {
        type: String,
        required: false,
        trim: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    },
    video: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },

}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

schoolSchema.index({ name: 'text', description: 'text' });

// Create the School model from the schema
const School = mongoose.model('School',schoolSchema);

// Export the model so it can be used in other parts of the application
module.exports = {School};
