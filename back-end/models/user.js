const mongoose = require("mongoose");
const { Schema } = mongoose
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    token: {
      type: String
    }
  },
  { timestamps: true }
);

function preprocess() {
  const { password } = this;
  const salt = bcrypt.genSaltSync();
  this.password = bcrypt.hashSync(password, salt);
}

UserSchema.pre("save", preprocess);

UserSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
