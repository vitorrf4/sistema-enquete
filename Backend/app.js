// imports
const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

// configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// start 
const PORT = process.env.PORT || 3000;
const enqueteService = require("./services/enqueteService");

app.listen(PORT, async () => {
  console.log(`Ouvindo na porta ${PORT}`);

  await enqueteService.checkEnqueteStatus();
});

// debugging middleware
app.all("*", (req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === "POST" || req.method === "PUT")
    console.log(req.body);

  next();
});

// routes
const enquetesRouter = require("./routers/enqueteRouter");
app.use(enquetesRouter);

const opcaoRouter = require("./routers/opcaoRouter");
app.use(opcaoRouter);

const sseController = require('./controllers/sseController');
app.use(sseController);

app.all("*", (req, res) => {
  res.status(404).json({"error": `${req.method} ${req.url} não é um endpoint válido`});
});


module.exports = app;