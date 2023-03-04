const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const { sendEmail } = require("../controllers/emailController");

router.use(verifyToken);

router.post('/', sendEmail);

module.exports = router;
