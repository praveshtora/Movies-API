const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const app = express();
const graphqlSchema = require('./schema');
const resolver = require('./resolvers/index');
const jwt = require('express-jwt');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());

// authentication middleware,sets req.user
const authMiddleware = jwt({
  secret: 'secret',
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }

});

app.use(authMiddleware);

app.use('/graphql', graphqlHttp( req => {
  return {
  schema: graphqlSchema,
  context: {
    user : req.user
  },
  rootValue: resolver,
  graphiql: true,
  customFormatErrorFn: (error) => {
    console.log(error);
    return ({ message: error.message, statusCode: error.statusCode });
  }
}
}));

const CONNECTION_URL = "mongodb://127.0.0.1:27017/movies-db";

const connectDb = async () => {
  try {
    const db = await mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });
    if (db) {
      app.listen(port);
      console.log(`Listening to port ${port}`);
    }
  } catch (err) {
    console.log(err);
  }
}

connectDb();
