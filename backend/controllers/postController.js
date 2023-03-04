const Post = require('../models/Post');
const User = require('../models/User');
const SubGreddiit = require('../models/subGreddiit');
const Report = require("../models/Report");

const createPost = async (req, res, next) => {
    try {
        const { title, content, user, userName, subGreddit } = req.body;

        if(!title || !content){
            return res.status(400).json({ success: false, message: 'Data is missing' });
        }

        const originalContent = content;

        // Fetch the subGreddit document from the database
        const subGredditDoc = await SubGreddiit.findById(subGreddit);

        // Use the banned keywords array directly
        const bannedWords = subGredditDoc.bannedKeywords;

        // Check for banned words in content
        const regex = new RegExp(bannedWords.join("|"), "gi");
        const sanitizedContent = content.replace(regex, match => "*".repeat(match.length));

        // Create the post document
        const post = new Post({ title, user, userName, subGreddit, originalContent });

        // Set the sanitized content
        post.content = sanitizedContent;

        // Save the post to the database
        await post.save();

        // Update the postCount field of the subGreddit document
        subGredditDoc.postCount += 1;
        await subGredditDoc.save();

        if (sanitizedContent !== content) {
            res.status(201).json({ success: true, message: "Used Banned Keywords" });
        } else {
            res.status(201).json({ success: true, message: "Post registered successfully" });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: "Unsuccessful registration" });
    }
};

const getPost = async (req, res) => {
    try {
        const { subGreddiitId } = req.params;
        // console.log(subGreddiitId)
        const posts = await Post.find({ subGreddit: subGreddiitId }).populate('user');
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

const upvotePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.upvotedBy.includes(userId)) {
            return res.status(200).json({ success: true, message: 'Already upvoted' });
        }

        // post.upvotes += 1;
        post.upvotedBy.push(userId);
        await post.save();

        return res.status(200).json({ success: true, message: 'Upvoted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const downvotePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.downvotedBy.includes(userId)) {
            return res.status(200).json({ success: true, message: 'Already downvoted' });
        }

        // post.downvotes += 1;
        post.downvotedBy.push(userId);
        await post.save();

        return res.status(200).json({ success: true, message: 'Downvoted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const savePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.saved.includes(postId)) {
            return res.status(200).json({ success: true, message: 'Already saved' });
        }

        user.saved.push(postId);
        await user.save();

        return res.status(200).json({ success: true, message: 'Post Saved successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error saving post' });
    }
}

const getSavedPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('saved');
        res.json(user.saved);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const deletedReports = await Report.deleteMany({ post: postId });
        console.log(`Deleted ${deletedReports.deletedCount} reports`);

        const subGredditId = deletedPost.subGreddit;
        const subGreddit = await SubGreddiit.findById(subGredditId);
        subGreddit.postCount -= 1;
        await subGreddit.save();
        
        return res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createPost, getPost, upvotePost, downvotePost, savePost, getSavedPosts, deletePost
};
