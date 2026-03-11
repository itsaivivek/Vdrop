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

router.get('/', async (req, res)=>{
    res.render('index')
})

router.get('/home', authMiddleware, async(req, res) => {
    const userFiles = await fileModel.find({
        userId: req.user.userId
    })
    const numberOfFiles = await fileModel.countDocuments({
        userId: req.user.userId
    })

    res.render('home', {
        files: userFiles,
        uploadedFiles: numberOfFiles,
    })

})

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        // Debug: Check if req.user exists
        if (!req.user.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const inputFile = InputFile.fromBuffer(req.file.buffer, req.file.originalname);

         // 1. Upload to Appwrite Storage
        const response = await storage.createFile(
            process.env.BUCKET_ID, 
            ID.unique(), 
            inputFile
        );
        
        // 2. Save metadata to MongoDB
        await fileModel.create({
            userId: req.user.userId, // From authMiddleware
            fileId: response.$id,
            fileName: req.file.originalname,
            fileSize: req.file.size, // for storage used
        });

        // res.json({ message: 'Upload success', fileId: response.$id, user: req.user.userId });
        
        // redirect after upload sucess
        res.redirect('/home')
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/download/:fileId', authMiddleware, async(req, res) =>{
    
    // Find file by comparing request user to loggedinUser
    const fileDoc = await fileModel.findOne({
        userId: req.user.userId,
        fileId: req.params.fileId
    })

    if(!fileDoc){
        return res.status(404).json({
            message: 'File not found or unauthorized'
        })
    }
    
    try{
        // Get metadata for proper content-type
        const fileMeta = await storage.getFile(process.env.BUCKET_ID, req.params.fileId);

        // Get actual file bytes
        const buffer = await storage.getFileDownload(process.env.BUCKET_ID, req.params.fileId);

        res.setHeader('Content-Type', fileMeta.mimeType || 'application/octet-stream')
        res.setHeader('Content-Disposition', `attachment;filename="${encodeURIComponent(fileDoc.fileName)}"`);
        res.setHeader('Content-Length', buffer.byteLength);
        
        res.send(Buffer.from(buffer));
    } catch(err){
        console.error(err);
        res.status(500).json({error: 'Download failed'})
    }
})

module.exports = router;