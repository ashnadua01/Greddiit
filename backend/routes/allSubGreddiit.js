const express = require('express');
const router = express.Router();
const { getAllSubgreddiits } = require('../controllers/allSubGreddiitController');
const { verifyToken } = require("../middleware/verifyToken");

router.use(verifyToken);

router.get("/", getAllSubgreddiits);

module.exports = router;