const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActorSchema = new Schema(
  {
    name : {
      type : String
    },
    birthday : {
      type : String,
    },
    country : {
      type : String,
    },
    directors : [{ type: Schema.Types.ObjectId, ref: 'Director', default: [] }]
  }
);

module.exports = mongoose.model('Actor', ActorSchema);