const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');
const { createReport, getReports, ignoreReport, blockUser, userBlocked, deleteOldReports } = require('../controllers/reportController');

router.use(verifyToken);

router.post('/:subgreddiitId', createReport);
router.get('/:subgreddiitId', getReports);
router.post('/:reportId/ignore', ignoreReport);
router.put('/:reportId/block', userBlocked);
router.delete('/:subGreddiitId/oldReports', deleteOldReports);
router.put('/:subGreddiitId/:postId/block-user', blockUser);

module.exports = router;
