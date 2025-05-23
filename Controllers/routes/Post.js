const express = require('express');
const router = express.Router();
const { Post } = require('../../Models/Post');
const {verifyToken} = require("../middlewares/VerifyToken");
const {uploadToCloudinary} = require("../../utils/cloudinaryUploader");

// CREATE Post
router.post('/',verifyToken, async (req, res) => {
    try {
        const { title, description, images = [], youtube_video = [] } = req.body;

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ error: 'Valid post title is required' });
        }

        // Upload each image to Cloudinary and get URL
        const imageUploadPromises = images.map(async (image, index) => {
            const result = await uploadToCloudinary(image, `post_image_${Date.now()}_${index}`);
            return result.url; // Only keep the URL
        });

        const uploadedImageUrls = await Promise.all(imageUploadPromises);

        // Create the post
        const post = new Post({
            title: title.trim(),
            description: description?.trim(),
            images_url: uploadedImageUrls,
            youtube_video: youtube_video.map(v => v.trim())
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// GET All Posts (with populated comments)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('comments');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Post by ID (with comments)
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('comments');
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE Post by ID
router.delete('/:id',verifyToken, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
