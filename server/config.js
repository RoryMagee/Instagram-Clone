const dotenv = require('dotenv').config();

module.exports = {
    database: 'mongodb://' + process.env.mongo_username + ':' + process.env.mongo_password + '@ds125125.mlab.com:25125/instagram'
}