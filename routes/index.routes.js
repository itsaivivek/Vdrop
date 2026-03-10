const express = require('express');

const router = express.Router();
const upload = require('../config/multer.config')
const { storage, sdk } = require('../config/appwrite.config');
const { InputFile } = require('node-appwrite/file');

router.get('/home', (req, res) => {
    res.render('home');
})

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        // Upload to Appwrite Storage
        const appwriteFile = await storage.createFile(
            process.env.BUCKET_ID,
            sdk.ID.unique(), // is better over 'unique()' string
            sdk.InputFile.fromBuffer(req.file.buffer, req.file.originalname),
            [
                // Grant READ and WRITE only to this specific user
                sdk.Permission.read(sdk.Role.user(req.user.id)),
                sdk.Permission.write(sdk.Role.user(req.user.id)),
            ]
        );
        res.json(appwriteFile);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;