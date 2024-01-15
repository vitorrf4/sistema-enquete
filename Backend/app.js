// imports
const express = require('express');
const app = express();
const enquetesRouter = require("./routers/enqueteRouter");
const enqueteService = require("./services/enqueteService");
const cors = require('cors');
require("dotenv").config();

// configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// start 
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Ouvindo na porta ${PORT}`);

  await enqueteService.checkEnqueteStatus();
});

// debug middleware
app.all("*", (req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === "POST" || req.method === "PUT")
    console.log(req.body);

  next();
});

// routes
app.use(enquetesRouter);
app.all("*", (req, res) => {
  res.status(404).json({"error": `${req.method} ${req.url} não é um endpoint válido`})
});


module.exports = app;