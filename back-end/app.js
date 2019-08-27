const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const app = express();
const graphqlSchema = require('./schema');
const resolver = require('./resolvers/index');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/hello', (req, res, next) => res.send({ message: 'hello ScoutBase' }));

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: resolver,
  graphiql: true,
  customFormatErrorFn : (error) => {
    return ({message: error.message, statusCode : error.statusCode});
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
