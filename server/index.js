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
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.set('port', 8081);

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

var server = http.createServer(app);

app.listen(8081, (err) => {
    console.log("server listening on port 8081");
});