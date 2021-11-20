const Sauce = require("../models/sauce");
const fs = require("fs");
exports.createThing = (req, res, next) => {
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

exports.like = (req, res, next) => {
  const id = req.params.id;
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      if (req.body.like == 1) {
        //on ajoute like
        if (sauce.usersLiked.find((id) => id == req.body.userId)) {
          return res
            .status(400)
            .json({ message: "l'utilisateur aime déja la sauce" });
        }
        if (sauce.usersDisliked.find((id) => id == req.body.userId)) {
          return res
            .status(400)
            .json({ message: "il faut disliker avant liker" });
        }
        sauce.likes++;
        sauce.usersLiked.push(req.body.userId);
        sauce.save();
        return res.status(200).json({ message: "l'utilisateur aime la sauce" });
      }

      if (req.body.like == 0) {
        //  on annulle dislike ou like
        if (sauce.usersLiked.find((id) => id == req.body.userId)) {
          sauce.likes--;
          const index = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(index, 1);
          sauce.save();
          return res
            .status(200)
            .json({ message: "l'utilisateur  annule like sauce" });
        }
        if (sauce.usersDisliked.find((id) => id == req.body.userId)) {
          sauce.likes--;
          const index = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersDisliked.splice(index, 1);
          sauce.save();
          return res
            .status(200)
            .json({ message: "l'utilisateur  annule dislike sauce" });
        }
        return res
          .status(208)
          .json({ message: "l'utilisateur  n'a aucun avis" });
      }
      if (req.body.like == -1) {
        if (sauce.usersDisliked.find((id) => id == req.body.userId)) {
          return res.status(400).json({
            message:
              "l'utilisateur à déjà mentionner son dislike à cette sauce",
          });
        }
        if (sauce.usersLiked.find((id) => id == req.body.userId)) {
          return res.status(400).json({
            message: "Il faut annuler le like avant disliker",
          });
        }
        sauce.dislikes++;
        sauce.usersDisliked.push(req.body.userId);
        sauce.save();
        return res
          .status(200)
          .json({ message: "l'utilisateur n'aime pas la sauce" });
      }
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
exports.getOneThing = (req, res, next) => {
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

exports.modifyThing = (req, res, next) => {
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

exports.deleteThing = (req, res, next) => {
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
  // Sauce.deleteOne({ _id: req.params.id })
  //   .then(() => {
  //     res.status(200).json({
  //       message: "Deleted!",
  //     });
  //   })
  //   .catch((error) => {
  //     res.status(400).json({
  //       error: error,
  //     });
  //   });
};

exports.getAllStuff = (req, res, next) => {
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
