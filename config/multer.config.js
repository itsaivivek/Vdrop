
const multer = require('multer');

// Store files in memory so we can access req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;