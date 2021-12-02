const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
// "mongoose-unique-validator"permet de  prévalider les informations avant de les enregistrer
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//l'ajout de'unique'+ l'élément 'mongoose-unique-validator' passé comme plug-in, s'assurera que deux utilisateurs ne puissent pas partager la même adresse e-mail.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
