const User = require('../models/User');
// const SubGreddiit = require('../models/SubGreddiit');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Find the user in the database
        const user = await User.findOne({ username });

        // If the user is not found, return an error
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid User' });
        }
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        // If the password is incorrect, return an error
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        // Create and sign the JSON web token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '100d' });

        // Return the token in the response
        res.status(200).json({ success: true, message: 'Logged in successfully', token });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
        next(err);
    }
};

module.exports = {
    login
};