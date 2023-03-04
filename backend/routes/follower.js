const express = require('express');
const router = express.Router();
const { acceptRequest, rejectRequest, removeFollower } = require('../controllers/requestController');
const { verifyToken } = require("../middleware/verifyToken")

router.use(verifyToken);

router.post('/followSubreddit', acceptRequest);
router.post('/rejectFollower', rejectRequest);
router.post('/removeFollower', removeFollower);

module.exports = router;
