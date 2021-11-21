const Sauce = require("../models/sauce");
const fs = require("fs");
let Utils = require("../lib/utils");

exports.createSauce = (req, res, next) => {
  const object = JSON.parse(req.body.sauce);
  delete object._id;
  const sauce = new Sauce({
    ...object,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.avisUser = (req, res, next) => {
  const id = req.params.id;
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      if (req.body.like == 1) {
        return Utils.likeSauce(sauce, req.body.userId, res);
      }

      if (req.body.like == 0) {
        //  on annulle dislike ou like
        return Utils.cancelInteraction(sauce, req.body.userId, res);
      }
      if (req.body.like == -1) {
        return Utils.dislikeSauce(sauce, req.body.userId, res);
      }
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...thingObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
