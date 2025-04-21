const express = require('express');
const router = express.Router();
const { Comment } = require('../../Models/Comment');
const { Post } = require('../../Models/Post');
const {verifyToken} = require("../middlewares/VerifyToken");

// CREATE Comment and associate with a post
router.post('/', async (req, res) => {
    try {
        const { post, content } = req.body;

        if (!post) return res.status(400).json({ error: 'Post ID is required' });

        const comment = new Comment({
            post,
            content: content?.trim()
        });

        await comment.save();

        // Push comment to Post's comments array
        await Post.findByIdAndUpdate(post, { $push: { comments: comment._id } });

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET All Comments (with post details)
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find().populate('post');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a comment
router.delete('/:id',verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        // Remove comment reference from post
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id }
        });

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
