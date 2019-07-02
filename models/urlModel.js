const mongoose = require("mongoose");

urlSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  path: { type: String, unique: true, require: true },
  long_url: { type: String, require: true }
});

module.exports = mongoose.model("UrlModel", urlSchema);
