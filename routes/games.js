// JavaScript source code
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('realGames', { title: 'Welcome to real games!' });
});

module.exports = router;
