const { buildSchema } = require("graphql");
const fs = require("fs");
const path = require("path")

const schemaDefinition = fs.readFileSync(path.join(__dirname,'schema.graphql'),"utf-8");
const schema = buildSchema(schemaDefinition);

module.exports = schema;
