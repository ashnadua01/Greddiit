const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.use(verifyToken);

module.exports = router;
