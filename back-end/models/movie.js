const mongoose = require("mongoose");
const { Schema } = mongoose;

const MovieSchema = new Schema(
  {
    title : {
      type : String
    },
    year : {
      type : Number
    },
    rating : {
      type : Number
    },
    actors : {
      type : [{ type: Schema.Types.ObjectId, ref: 'Actor', default: [] }]
    }
  }
);

module.exports = mongoose.model('Movie', MovieSchema)