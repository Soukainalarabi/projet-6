const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

//on a utilisé des route POST car le frontend va egalement envoyer des informations
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);


module.exports = router;
