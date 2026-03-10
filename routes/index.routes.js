const express = require('express');

const router = express.Router();
const upload = require('../config/multer.config')
const { storage, sdk } = require('../config/appwrite.config');
// const { Storage, ID, Permission, Role } = require('node-appwrite');
// const { File } = require('web-file-polyfill'); 
// No need to import InputFile anymore

const fileModel = require('../models/file.models')
const { ID, InputFile } = require('node-appwrite');

const authMiddleware = require('../middlewares/authe');
const auth = require('../middlewares/authe');

router.get('/home', authMiddleware, async(req, res) => {
    res.render('home');
})

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        console.log("user.id = ", req.user.userId)
        // Debug: Check if req.user exists
        if (!req.user.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
         // 1. Upload to Appwrite Storage
        const response = await storage.createFile(
            process.env.BUCKET_ID, 
            ID.unique(), 
            new File([req.file.buffer], req.file.originalname)
        );
        console.log("resposse.id = ", response.$id)
        // 2. Save metadata to MongoDB
        await fileModel.create({
            userId: req.user.userId, // From your authMiddleware
            fileId: response.$id,
            fileName: req.file.originalname
        });

        res.json({ message: 'Upload success', fileId: response.$id, user: req.user.userId });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;