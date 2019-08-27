const User = require("../models/user");
const Movie = require("../models/movie");
const Actor = require("../models/actor");
const Director = require("../models/director");

const internalServerError = () => {
  const internalServerError = new Error();
  internalServerError.message = "Internal server Error";
  internalServerError.statusCode = 500;
  throw internalServerError;
}
module.exports = {
  createUser: async ({ username, password }, req) => {
    try {
      const user = new User({ name: username, password: password });
      const newlyAddedUser = await user.save();
      return {
        ...newlyAddedUser._doc,
        id: newlyAddedUser._id.toString()
      };
    } catch (err) {
      internalServerError();
    }
  },
  login: async ({ username, password }) => {
    try {
      const user = User.findOne({ name: username });
      if (!user) {
        const err = new Error();
        err.type = "invalid-username/password";
        err.message = "Password and username doesnot match";
        err.statusCode = 400;
        throw err;
      }
      if (!user.validatePassword(password)) {
        const err = new Error();
        err.type = "invalid-username/password";
        err.message = "Password and username doesnot match";
        err.statusCode = 400;
        throw err;
      }
      return { ...user._doc, id: user._id.toString() };
    } catch (error) {
      if (error.type === "invalid-username/password") {
        throw error;
      } else {
        internalServerError();
      }
    }
  },
  movies: async () => {
    try {
      const movies = await Movie.find({}).populate({
        path: "actors",
        populate: {
          path: "directors"
        }
      });
      return movies.map(movie => ({ ...movie._doc }));
    } catch (err) {
      internalServerError();
    }
  }
};
