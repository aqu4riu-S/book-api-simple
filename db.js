const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
    // establishes db connection
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://127.0.0.1:27017/bookstore')
            .then((client) => {
                dbConnection = client.db()
                return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },

    // returns db connection
    getDb: () => dbConnection
}