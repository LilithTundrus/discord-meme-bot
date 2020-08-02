var MongoClient = require('mongodb').MongoClient;

try {
    // Connect to the db
    MongoClient.connect("mongodb://192.168.2.122:27017/", function (err, db) {

        if (err) throw err;

        //Write databse Insert/Update/Query code here..
        console.log('AAAAA')

    });
} catch (err) {
    console.log(err)
}
