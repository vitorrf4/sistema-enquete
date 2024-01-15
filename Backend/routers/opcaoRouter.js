const express = require("express");
const opcaoController = require("../controllers/opcaoController");
const router = express();

router.post('/opcoes/:id', async (req, res) => {
    await opcaoController.addVoto(req, res)
});

module.exports = router;