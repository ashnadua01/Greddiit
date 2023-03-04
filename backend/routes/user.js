const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');
const { getSavedPosts, deleteSavedPost, addFollower, addFollowing, getUserDetails, updateDetails, removeFollower, removeFollowing } = require('../controllers/userController');

router.use(verifyToken);

router.get('/:userId/saved', getSavedPosts);
router.get('/:userId/details', getUserDetails);
router.put('/:userId/update', updateDetails);
router.delete('/:postId', deleteSavedPost);
router.post('/:creatorId/followers', addFollower);
router.post('/:id/following', addFollowing);
router.delete('/:userId/followers/:followerId', removeFollower);
router.delete('/:userId/following/:followingId', removeFollowing);

module.exports = router;
