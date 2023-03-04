const User = require('../models/User');
// const SubGreddiit = require('../models/SubGreddiit');
// const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password, age, contactNumber } = req.body;

    // Validate incoming data
    if (!firstName || !lastName || !email || !username || !age || !contactNumber) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const isValid = isValidInput(firstName, lastName, email, username, password, age, contactNumber);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the data to MongoDB
    const user = new User({ firstName, lastName, email, username, password: hashedPassword, age, contactNumber });
    await user.save();

    res.status(200).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register
};