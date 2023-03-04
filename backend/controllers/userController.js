// const Post = require('../models/Post');
const User = require('../models/User');
// const SubGreddiit = require('../models/SubGreddiit');

const getSavedPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate({
            path: 'saved',
            populate: {
                path: 'subGreddit',
                model: 'SubGreddiit',
            },
        });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.saved);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const deleteSavedPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const postId = req.params.postId;

        if (!user.saved.includes(postId)) {
            return res.status(400).json({ success: false, msg: 'Post not saved by user' });
        }

        user.saved.pull(postId);
        await user.save();

        res.json({ success: true, msg: 'Post removed from saved list' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const addFollower = async (req, res) => {
    try {
        const userId = req.params.creatorId;
        const user = await User.findById(userId);
        const followerId = req.body.followerId;

        if (followerId.toString() === userId.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
        }

        if (!user.followers.includes(followerId)) {
            user.followers.push(followerId);
            await user.save();
            res.status(201).json({ success: true, message: 'Followed successfully' });
        } else {
            res.status(400).json({ success: false, message: 'User is already a follower.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


const addFollowing = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        const followingId = req.body.followingId;

        if (userId === followingId) {
            res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
            return;
        }

        if (!user.following.includes(followingId)) {
            user.following.push(followingId);
            await user.save();
            res.status(201).json({ success: true, message: 'Following added successfully' });
        } else {
            res.status(400).json({ success: false, message: 'User is already following.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId)
            .populate({ path: 'followers' })
            .populate({ path: 'following' });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



const updateDetails = async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, email, age, contactNumber, username, bio } = req.body;

    try {
        // Check if user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        flag = 1;
        // update the properties only if they've changed
        const update = {};

        if (email !== user.email) {
            const emailExists = await User.findOne({ email: email });
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({ success: false, message: "Email already exists", user });
            } else {
                update.email = email;
            }
        }

        if (firstName !== user.firstName) {
            update.firstName = firstName;
        }

        if (lastName !== user.lastName) {
            update.lastName = lastName;
        }

        if (age !== user.age) {
            update.age = age;
        }

        if (contactNumber !== user.contactNumber) {
            update.contactNumber = contactNumber;
        }

        if (bio !== user.bio) {
            update.bio = bio;
        }

        // update the user object in the database
        const send = await User.findByIdAndUpdate(userId, update, { new: true });

        res.status(200).json({ success: true, message: "User Details updated", send });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const removeFollower = async (req, res) => {
    try {
        const currentUser = req.params.userId;
        const follower = req.params.followerId;

        const updatedCurrentUser = await User.findByIdAndUpdate(
            currentUser,
            { $pull: { followers: follower } },
            { new: true }
        );

        const updatedFollower = await User.findByIdAndUpdate(
            follower,
            { $pull: { following: currentUser } },
            { new: true }
        );

        res.status(200).json({
            message: `User removed successfully`,
            currentUser: updatedCurrentUser,
            follower: updatedFollower,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFollowing = async (req, res) => {
    try {
        const currentUser = req.params.userId;
        const following = req.params.followingId;

        const updatedCurrentUser = await User.findByIdAndUpdate(
            currentUser,
            { $pull: { following: following } },
            { new: true }
        );

        const updatedFollowing = await User.findByIdAndUpdate(
            following,
            { $pull: { followers: currentUser } },
            { new: true }
        );

        res.status(200).json({
            message: `User removed successfully`,
            currentUser: updatedCurrentUser,
            following: updatedFollowing,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getSavedPosts, deleteSavedPost, addFollower, addFollowing, getUserDetails, updateDetails, removeFollower, removeFollowing
};