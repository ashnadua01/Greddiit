const User = require('../models/User');
const SubGreddiit = require('../models/subGreddiit');
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

const sendRequest = async (req, res) => {
    try {
        const { userId, username, subgredditId } = req.body;

        const subgreddiit = await SubGreddiit.findById(subgredditId)

        if (!subgreddiit) {
            return res.status(404).json({ success: false, message: 'SubGreddiit not found' });
        }

        if (subgreddiit.requests.includes(userId)) {
            return res.status(200).json({ success: true, message: 'Request already sent' });
        }

        if (subgreddiit.removed.includes(username)) {
            return res.status(403).json({ success: false, message: 'User cannot join again' })
        }

        if (subgreddiit.blockedUsers.includes(userId)) {
            return res.status(403).json({ success: false, message: 'User is blocked and cannot send a request' });
        }

        subgreddiit.requests.push(userId);
        await subgreddiit.save();

        res.status(200).json({ success: true, message: 'Request sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send request' });
    }
};


const getRequests = async (req, res) => {
    try {
        const id = req.params.subGreddiitId;
        const subgreddiit = await SubGreddiit.findById(id).populate('requests');
        res.json(subgreddiit.requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const acceptRequest = async (req, res) => {
    const { subgredditId, username, userId } = req.body;
    try {
        // Check if the subreddit and user exist
        const subgreddiit = await SubGreddiit.findById(subgredditId);
        const user = await User.findOne({ username: username });

        if (!subgreddiit) {
            return res.status(404).json({ success: false, message: 'Subreddit not found' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the user is already following the subreddit
        if (subgreddiit.followers.includes(userId)) {
            return res.status(400).json({ success: false, message: 'User is already following the subreddit' });
        }

        // Add the user to the subreddit's list of followers
        subgreddiit.followers.push(userId);

        // Update the follower history
        const followerCount = subgreddiit.followers.length;
        const timestamp = new Date();
        subgreddiit.followerHistory.push({ count: followerCount, timestamp });

        const index = subgreddiit.requests.indexOf(userId);
        if (index > -1) {
            subgreddiit.requests.splice(index, 1);
        }
        await subgreddiit.save();

        res.status(200).json({ success: true, message: 'User added as follower' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


const rejectRequest = async (req, res) => {
    const { subgredditId, userId } = req.body;
    try {
        const subgreddiit = await SubGreddiit.findById(subgredditId);
        if (!subgreddiit) {
            return res.status(404).json({ success: false, message: 'Subreddit not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const index = subgreddiit.requests.indexOf(userId);
        if (index > -1) {
            subgreddiit.requests.splice(index, 1);
        }
        await subgreddiit.save();

        res.status(200).json({ success: true, message: 'User rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const removeFollower = async (req, res) => {
    const { subgredditId, username } = req.body;
    const userId = req.user.id;
    try {
        const subgreddiit = await SubGreddiit.findById(subgredditId);
        if (!subgreddiit) {
            return res.status(404).json({ success: false, message: 'Subreddit not found' });
        }

        subgreddiit.removed.push(username);
        const index = subgreddiit.followers.indexOf(userId);
        if (index > -1) {
            subgreddiit.followers.splice(index, 1);
            
            // Update the follower history
            const followerCount = subgreddiit.followers.length;
            const timestamp = new Date();
            subgreddiit.followerHistory.push({ count: followerCount, timestamp: timestamp });
        }
        await subgreddiit.save();

        res.status(200).json({ success: true, message: 'Subgreddit left successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {
    sendRequest, getRequests, acceptRequest, rejectRequest, removeFollower
};
