const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //on a ajouté unique pour qu'une seule cnx sera effectuer avec la meme adresse mail + mongoose-unique-validator
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
