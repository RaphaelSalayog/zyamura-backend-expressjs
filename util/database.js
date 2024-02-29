const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnection = (listenerCallback) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}.mongodb.net/?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("connected");
      _db = client.db(process.env.MONGO_DEFAULT_DATABASE);
      listenerCallback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnection = mongoConnection;
exports.getDb = getDb;
