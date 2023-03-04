const express = require('express');
const router = express.Router();
const { createPost, getPost, upvotePost, downvotePost, savePost, deletePost } = require("../controllers/postController");
const { verifyToken } = require("../middleware/verifyToken");

router.use(verifyToken);

router.post('/', createPost);
router.get('/:subGreddiitId', getPost);
router.post('/:postId/upvote', upvotePost);
router.post('/:postId/downvote', downvotePost);
router.post('/:postId/savepost', savePost);
router.delete('/:postId', deletePost);

module.exports = router;
