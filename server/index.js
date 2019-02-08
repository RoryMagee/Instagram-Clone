const express  = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config')
const cors = require('cors');
const http = require('http');

const app = express();

//Mongoose connection code goes here
mongoose.connect(config.database, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("connected to DB");
        }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.set('port', 8081);

// const mainRoutes = require('./routes/main');
// app.use(mainRoutes);
const mainRoutes = require('./routes/main');
app.use('/api', mainRoutes);

var server = http.createServer(app);

app.listen(8081, (err) => {
    console.log("server listening on port 8081");
});