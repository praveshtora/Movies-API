const mongoose = require("mongoose");
const { Schema } = mongoose;


const DirectorSchema = new Schema(
  {
    name : {
      type : String
    },
    birthday : {
      type : String,
    },
    country : {
      type : String,
    }
  }
);

module.exports = mongoose.model('Director', DirectorSchema);