function annulerLike(sauce, userId) {
  sauce.likes--;
  const index = sauce.usersLiked.indexOf(userId);
  sauce.usersLiked.splice(index, 1);
  sauce.save();
}
function annulerDislike(sauce, userId) {
  sauce.dislikes--;
  const index = sauce.usersLiked.indexOf(userId);
  sauce.usersDisliked.splice(index, 1);
  sauce.save();
}

function cancelInteraction(sauce, userId, res) {
  //  on annulle dislike ou like
  if (sauce.usersLiked.find((id) => id == userId)) {
    annulerLike(sauce, userId);
    return res
      .status(200)
      .json({ message: "l'utilisateur  annule like sauce" });
  }
  if (sauce.usersDisliked.find((id) => id == userId)) {
    annulerDislike(sauce, userId);
    return res
      .status(200)
      .json({ message: "l'utilisateur  annule dislike sauce" });
  }
  return res.status(208).json({ message: "l'utilisateur  n'a aucun avis" });
}
function likeSauce(sauce, userId, res) {
  if (
    sauce.usersLiked.find((id) => id == userId) ||
    sauce.usersDisliked.find((id) => id == userId)
  ) {
    return res.status(400).json({
      message:
        "l'utilisateur a déjà mentionné son like ou dislike à cette sauce",
    });
  }
  sauce.likes++;
  sauce.usersLiked.push(userId);
  sauce.save();
  return res.status(200).json({ message: "l'utilisateur aime la sauce" });
}
function dislikeSauce(sauce, userId, res) {
  if (
    sauce.usersDisliked.find((id) => id == userId) ||
    sauce.usersLiked.find((id) => id == userId)
  ) {
    return res.status(400).json({
      message:
        "l'utilisateur à déjà mentionner son dislike ou like à cette sauce",
    });
  }
  sauce.dislikes++;
  sauce.usersDisliked.push(userId);
  sauce.save();
  return res.status(200).json({ message: "l'utilisateur n'aime pas la sauce" });
}
module.exports = {
  annulerLike,
  annulerDislike,
  cancelInteraction,
  likeSauce,
  dislikeSauce,
};
