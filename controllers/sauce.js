const Sauce = require("../models/sauce");
const fs = require("fs"); //Le package fs expose des méthodes pour interagir avec le système de fichiers du serveur.
let Utils = require("../lib/utils");

exports.createSauce = (req, res, next) => {
  const object = JSON.parse(req.body.sauce); //convertir le json à  un objet.

  delete object._id;
  const sauce = new Sauce({
    ...object,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}
    ://${req.get("host")} 
    /images/${req.file.filename}`,
  });
  //://${req.get("host")}: pour résoudre l'hôte du serveur (ici, 'localhost:3000')
  //{req.protocol}:pour obtenir le premier segment (dans notre cas 'http')
  ///images/${req.file.filename}: le dossier et le nom du fichier
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
        // on ajoute le like
        return Utils.likeSauce(sauce, req.body.userId, res);
      }

      if (req.body.like == 0) {
        //  on annulle dislike ou like
        return Utils.cancelInteraction(sauce, req.body.userId, res);
      }
      if (req.body.like == -1) {
        // on ajoute le dislike
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
      //si suuce trouvé
      res.status(200).json(sauce);
    })
    .catch((error) => {
      // si sauce no trouvé retourne 404
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  const thingObject = req.file
    ? //cet objet regarde si 'req.file' existe ou non .S'il existe, on traite la nouvelle image sinon on traite simplement l'objet entrant
      {
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
      const filename = sauce.imageUrl.split("/images/")[1]; // nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
      fs.unlink(`images/${filename}`, () => {
        // la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
        Sauce.deleteOne({ _id: req.params.id }) // dans le callback, nous implémentons la logique d'origine, en supprimant la sauce de la base de données.

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
