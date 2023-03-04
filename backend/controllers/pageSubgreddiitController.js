// const User = require('../models/User');
const SubGreddiit = require('../models/subGreddiit');
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

const page = async (req, res) => {
    const subgreddiitId = req.params.subgreddiitId;

    try {
        const subgreddiit = await SubGreddiit.findOne({ subgreddiit: subgreddiitId })
            .populate("followers")
            .populate("blockedUsers");

        if (!subgreddiit) {
            res.status(404).send('Subgreddiit not found');
        } else {
            res.json(subgreddiit);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching subgreddiit from database');
    }
};

module.exports = {
    page
};
