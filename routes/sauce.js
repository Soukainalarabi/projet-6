const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const stuffCtrl = require("../controllers/sauce");
const multer = require("../middleware/multer-config");

router.post("/", multer, stuffCtrl.createThing);
router.post("/:id/like", stuffCtrl.like);

router.put("/:id", multer, stuffCtrl.modifyThing);
router.delete("/:id", stuffCtrl.deleteThing);
router.get("/:id", stuffCtrl.getOneThing);
router.get("/", stuffCtrl.getAllStuff);

module.exports = router;
