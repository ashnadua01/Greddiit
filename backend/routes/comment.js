const express = require('express');
const router = express.Router();
const { addComment, getComment } = require('../controllers/commentController.js');
const { verifyToken } = require("../middleware/verifyToken")

router.use(verifyToken);

router.post('/:postId/addComment', addComment);
router.get('/:postId/getComments', getComment);

module.exports = router;
