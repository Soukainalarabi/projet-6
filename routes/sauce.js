const express = require("express");
const router = express.Router(); //La méthode express.Router():permet de créer des routeurs séparés pour chaque route principale de notre application
const auth = require("../middleware/auth"); //pour proteger nos routes

const stuffCtrl = require("../controllers/sauce");
const multer = require("../middleware/multer-config");
//si on place le multer avant l'auth tous  les images seront enregister dans le serveur meme les images non authentifiées
router.post("/", auth, multer, stuffCtrl.createSauce);
router.post("/:id/like", auth, stuffCtrl.avisUser);

router.put("/:id", auth, multer, stuffCtrl.modifySauce);
router.delete("/:id", auth, multer, stuffCtrl.deleteSauce);
router.get("/:id", auth, stuffCtrl.getOneSauce);
router.get("/", auth, stuffCtrl.getAllSauces);

module.exports = router;
