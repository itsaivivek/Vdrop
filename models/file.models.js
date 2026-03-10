const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Appwrite User ID
    fileId: { type: String, required: true }, // Appwrite File ID
    fileName: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('file', fileSchema);
