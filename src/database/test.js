var MongoClient = require('mongodb').MongoClient;

try {
    // Connect to the db
    MongoClient.connect("mongodb://192.168.2.122:27017/memedb", function (err, db) {

        if (err) throw err;

        console.log('AAAAA')

    });
} catch (err) {
    console.log(err)
}
