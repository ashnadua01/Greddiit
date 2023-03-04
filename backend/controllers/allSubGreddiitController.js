// const User = require('../models/User');
const SubGreddiit = require('../models/subGreddiit');
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

const getAllSubgreddiits = async (req, res) => {
    try {
        const subgreddiits = await SubGreddiit.find();
        res.json(subgreddiits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSubgreddiits
};