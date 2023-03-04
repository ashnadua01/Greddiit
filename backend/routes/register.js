const express = require('express');
const router = express.Router();
const { register } = require('../controllers/registerController');

// Route to handle registration data
router.post('/', register);

module.exports = router;
