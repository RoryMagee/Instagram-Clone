const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const checkJWT = require('../middleware/check-jwt');

