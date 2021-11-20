const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
//on a utilier des route POST car le frontend va egalement envoyer des informations

module.exports = router;
