const User = require('../models/User');
const Post = require('../models/Post');
const SubGreddiit = require('../models/subGreddiit');
const Comment = require("../models/Comment");
const Report = require("../models/Report");
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");
// const multer = require('multer');
// const { upload } = require('../middleware/imageHandler');

const createMySubGreddiit = async (req, res, next) => {
    try {
        const { name, description, tags, bannedKeywords } = req.body;

        // Validate incoming data
        if (!name || !description || !tags || !bannedKeywords) {
            return res.status(400).json({ success: false, message: 'Data is missing' });
        }

        // Save the data to MongoDB and add the creator as a follower
        const creatorUsername = req.user.username;
        const creatorUserId = req.user.id;
        const subgr = new SubGreddiit({ name, description, tags, bannedKeywords, createdBy: creatorUsername, followers: [creatorUserId], followerHistory: [{ count: 1 }] });
        await subgr.save();

        res.status(201).json({ success: true, message: 'SubGreddit registered successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: `SubGreddit could not be registered: ${err.message}` });
        next(err);
    }
};

const getMySubGreddiit = async (req, res, next) => {
    try {
        const creatorUsername = req.user.username;
        const subGreddiits = await SubGreddiit.find({ createdBy: creatorUsername });
        res.status(200).json(subGreddiits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteMySubGreddiit = async (req, res, next) => {
    try {
        const creatorUsername = req.user.username;
        const subGreddiitId = req.params.id;

        // Check if the sub greddiit exists and was created by the authenticated user
        const subGreddiit = await SubGreddiit.findOne({ _id: subGreddiitId, createdBy: creatorUsername });
        if (!subGreddiit) {
            return res.status(404).json({ success: false, message: 'SubGreddiit not found or you are not authorized to delete it' });
        }

        // Find all the posts in the sub greddiit
        const posts = await Post.find({ subGreddit: subGreddiitId });

        // Find all the comments in the posts
        const comments = await Comment.find({ post: { $in: posts.map(post => post._id) } });

        // Delete all the comments related to the posts
        await Comment.deleteMany({ post: { $in: posts.map(post => post._id) } });

        // Delete all the reports for the posts in the sub greddiit
        await Report.deleteMany({ post: { $in: posts.map(post => post._id) } });

        // Find all users who have saved any of the posts in the sub greddiit
        const users = await User.find({ saved: { $in: posts.map(post => post._id) } });

        // Remove the sub greddiit's ID from each user's saved array
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            user.saved = user.saved.filter(postId => !posts.some(post => post._id.equals(postId)));
            await user.save();
        }

        // Delete all the posts in the sub greddiit
        await Post.deleteMany({ subGreddit: subGreddiitId });

        // Delete the sub greddiit from the database
        await subGreddiit.remove();

        res.status(200).json({ success: true, message: 'SubGreddiit deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}



module.exports = {
    createMySubGreddiit, getMySubGreddiit, deleteMySubGreddiit
};
