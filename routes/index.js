'use strict';
var express = require('express');
var router = express.Router();

module.exports = function makeRouterWithSockets (io, client) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    client.query('SELECT *, tweets.id AS tweet_id FROM tweets INNER JOIN users ON userid = users.id', function (err, result) {
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  // get tweets from a specific user only
  router.get('/users/:username', function(req, res, next){
    var sqlQuery = "SELECT *, tweets.id AS tweet_id FROM tweets INNER JOIN users ON userid = users.id WHERE name = '" + req.params.username + "'";
    client.query(sqlQuery, function (err, result) {
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });



    // var tweetsForName = tweetBank.find({ name: req.params.username });
    // res.render('index', {
    //   title: 'Twitter.js',
    //   tweets: tweetsForName,
    //   showForm: true,
    //   username: req.params.username
    // });
  });

  // single-tweet page
  // display single tweet based on id
  router.get('/tweets/:id', function(req, res, next){
    var sqlQuery = "SELECT *, tweets.id AS tweet_id FROM tweets INNER JOIN users ON userid = users.id WHERE tweets.id = " + req.params.id;
    client.query(sqlQuery, function (err, result) {
      var tweets = result.rows;
      res.render('index', { title: 'Twitter.js', tweets: tweets});
    });
    // var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
    // res.render('index', {
    //   title: 'Twitter.js',
    //   tweets: tweetsWithThatId // an array of only one element ;-)
    // });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    var name = req.body.name;
    var content = req.body.text;
    var sqlQuery1 = "SELECT id FROM users WHERE name = '" + name + "'";

    // function recursion() {
      client.query(sqlQuery1, function (err, result) {
        var userID = result.rows[0];
        console.log(userID)
        if (!userID) {
          var sqlQuery2 = "INSERT INTO users (name, pictureurl) VALUES ('" + req.body.name + "', 'http://lorempixel.com/48/48')";
          client.query(sqlQuery2, function (err, result) {
            client.query(sqlQuery1, function (err, result) {
            var userID = result.rows[0];
            var sqlQuery3 = "INSERT INTO tweets (userid, content) VALUES (" + userID.id + ", '" + content + "')";
            client.query(sqlQuery3, function (err, result) {
              res.redirect('/');
            })    

          }) 
          })  
        } else {
          var sqlQuery3 = "INSERT INTO tweets (userid, content) VALUES (" + userID.id + ", '" + content + "')";
          client.query(sqlQuery3, function (err, result) {
            res.redirect('/');
          })             
        }


      // client.query(sqlQuery1, function (err, result) {

      // }

      //res.render('index', { title: 'Twitter.js', tweets: tweets});
    }); 
    // }
    
    //var userI = recursion()
    //console.log(userI)  
    // var newTweet = tweetBank.add(req.body.name, req.body.text);
    // io.sockets.emit('new_tweet', newTweet);
    // res.redirect('/');
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
