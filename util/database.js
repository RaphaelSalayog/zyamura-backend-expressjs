const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnection = (listenerCallback) => {
  MongoClient.connect(
    "mongodb+srv://zyamura:0uDaRYX9Jbhi6CLZ@zyamura.ewpn9zp.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("connected");
      _db = client.db("zyamura");
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
