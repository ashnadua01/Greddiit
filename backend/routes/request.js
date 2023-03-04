const express = require('express');
const router = express.Router();
const { sendRequest, getRequests } = require('../controllers/requestController');
const { verifyToken } = require("../middleware/verifyToken")

router.use(verifyToken);

router.post('/:subGreddiitId', sendRequest);
router.get('/:subGreddiitId', getRequests);
// router.post('/', acceptRequest);

module.exports = router;
