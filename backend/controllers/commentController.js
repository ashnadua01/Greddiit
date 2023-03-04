// const User = require('../models/User');
// const SubGreddiit = require('../models/SubGreddiit');
// const Post = require("../models/Post");
const Comment = require("../models/Comment");
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if(!text){
            return res.status(400).json({ success: false, message: 'Data is missing' });
        }
        
        const postId = req.params.postId;
        const userId = req.user.id;

        const comment = new Comment({
            text,
            user: userId,
            post: postId
        });

        await comment.save();
        res.json({ success: true, message: "Comment saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

const getComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate({ path: 'user', model: 'User' }).exec();
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    addComment, getComment
};
