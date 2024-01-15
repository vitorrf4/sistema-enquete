const sseService = require('../services/sseService');
const express = require("express");
const router = express();

router.get('/connect', async (req, res) => {
    await sseService.connect(req, res);
});

module.exports = router;