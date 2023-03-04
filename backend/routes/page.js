const express = require('express');
const router = express.Router();
const { page } = require('../controllers/pageSubgreddiitController');
const { verifyToken } = require("../middleware/verifyToken");

router.use(verifyToken);

router.get('/:subgreddiitId', page);

module.exports = router;
