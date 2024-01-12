const express = require("express");
const produtoController = require("../controllers/enqueteController");
const router = express();

router.get('/enquetes', async (req, res) => {
  await produtoController.getEnquetes(req, res)
});

router.get('/enquetes/:id', async (req, res) => {
  await produtoController.getEnqueteById(req, res)
});

router.post('/enquetes', async (req, res) => {
  await produtoController.createEnquete(req, res)
});

router.put('/enquetes', async (req, res) => {
  await produtoController.updateEnquete(req, res)
});

router.delete('/enquetes/:id', async (req, res) => {
  await produtoController.deleteEnquete(req, res)
});

module.exports = router;