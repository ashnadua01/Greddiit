const express = require('express');
const router = express.Router();
const { createMySubGreddiit, getMySubGreddiit, deleteMySubGreddiit } = require('../controllers/subgreddiitController');
const { verifyToken } = require("../middleware/verifyToken");
// const { upload } = require("../middleware/imageHandler");

router.use(verifyToken);

router.post('/', createMySubGreddiit);
router.get('/', getMySubGreddiit);
router.delete('/:id', deleteMySubGreddiit);

module.exports = router;
