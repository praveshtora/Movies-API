const User = require("../models/user");
const Movie = require("../models/movie");
const Actor = require("../models/actor");
const Director = require("../models/director");
const jsonwebtoken = require("jsonwebtoken")

const internalServerError = () => {
  const internalServerError = new Error();
  internalServerError.message = "Internal server Error";
  internalServerError.statusCode = 500;
  throw internalServerError;
};
module.exports = {
  createUser: async ({ username, password }, req) => {
    try {
      const isExistingUser = await User.findOne({ name: username });
      if (isExistingUser.toObject()) {
        throw new Error('user-name-already-exist');
      }
      const user = new User({ name: username, password: password });
      const newlyAddedUser = await user.save();
      const token = jsonwebtoken.sign(
        {
          id: user.id,
          email: user.email
        },
        "secret",
        { expiresIn: "1y" }
      );
      return {
        user: { ...newlyAddedUser.toObject(), id: newlyAddedUser._id.toString() },
        token
      };
    } catch (err) {
      if (err.message === 'user-name-already-exist') {
        err.statusCode = 400;
        throw err;
      }
      internalServerError();
    }
  },
  login: async ({ username, password }) => {
    try {
      const user = await User.findOne({ name: username });
      if (!user) {
        throw new Error("user-name-not-found");
      }
      if (user && !user.validatePassword(password)) {
        throw new Error('invalid-username/password');
      }
      const token = jsonwebtoken.sign(
        {
          id: user.id,
          email: user.email
        },
        "secret",
        { expiresIn: "1y" }
      );
      console.log(user.toObject())
      return {
        user: { ...user.toObject(), id: user._id.toString() },
        token
      };
    } catch (error) {
      console.log('here');
      if (error.message === "invalid-username/password" || error.message === 'user-name-not-found') {
        error.statusCode = 400;
        throw error;
      } else {
        console.log(error)
        internalServerError();
      }
    }
  },
  movies: async (_, req) => {
    console.log(req);
    try {
      console.log(req);
      const movies = await Movie.find({}).populate({
        path: "actors",
        populate: {
          path: "directors"
        }
      });
      const getRandomRating = () => (Math.random() * (9 - 5) + 5).toFixed(1);
      return movies.map(movie => {
        if (req.user === undefined) {
          return {
            ...movie.toObject(),
          }
        } else {
          return {
            ...movie.toObject(),
            scoutbase_rating: getRandomRating()
          }
        }
      });
    } catch (err) {
      internalServerError();
    }
  }
}

