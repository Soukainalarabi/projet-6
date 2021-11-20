const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const stuffRoutes = require("./routes/sauce"); //importer le fichier stuff.js
const userRoutes = require("./routes/user");
mongoose
  .connect(
    "mongodb+srv://larabi_24:larabi24@cluster0.qb923.mongodb.net/Sauce?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
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
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", stuffRoutes); // ici on a fait le debut de la route de l api
app.use("/api/auth", userRoutes); //la route attendu par le frontend .la racine de tous ce qui est route lié à l'authentification
module.exports = app;
