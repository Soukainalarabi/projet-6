const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express(); //creer une application express
const stuffRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
let config = require("./config/config.json");

// on externalise la configuration de la base de données de MongoDB
mongoose
  .connect(config.mongodb.url, {
    useNewUrlParser: config.mongodb.useNewUrlParser,
    useUnifiedTopology: config.mongodb.useUnifiedTopology,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
//empêcher des erreurs CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//Le package body-parser permet d'analyse le corps de la requête et de le formater pour en faciliter l'exploitation.
app.use(bodyParser.json());

//Pour indiquer à Express qu'il faut gérer la ressource images de manière statique
app.use("/images", express.static(path.join(__dirname, "images")));

// on définit la route de l api et l'authentification
app.use("/api/sauces", stuffRoutes);
app.use("/api/auth", userRoutes);

//la route attendu par le frontend .la racine de tous ce qui est route lié à l'authentification
module.exports = app;
