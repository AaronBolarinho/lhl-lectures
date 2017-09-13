const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Our data storage module (a.k.a. Model)
// Notice we're loading it with `let` instead of `const`
// since we'll need to change data inside it.
let appleDB = require('./appleDB');

// Initialize express
const app = express();

// Use EJS for views
app.set("view engine", "ejs");

// As we discussed before, Express is a very barebones library.
// We can add different functionality using middlewares, which are functions
// that process requests before they're handed to your routing functions.
// See: http://expressjs.com/en/guide/using-middleware.html

// To work with forms and JSON data, we need to configure Express
// to use the bodyParser middleware to convert those types of data
// into JS objects inside our functions.
app.use(bodyParser.urlencoded({extended: false})); // forms
app.use(bodyParser.json()); // JSON

// I'm also adding a logging middleware so we can see what's going on
// with our server. More info: https://github.com/expressjs/morgan
app.use(morgan('dev'));


/*
 * Routing functions go here
 */

app.get('/', (req, res) => {
  // There's nothing on `/`, so I'll just redirect to `/apples`
  res.redirect('/apples');
});


// We're being RESTful here. Everything pertaining to apples
// will be under /apples.
app.get('/apples', (req, res) => {
  let apples = appleDB.getAll();
  // let templateVar = apples
  res.render('apples/index', {apples: apples, myName: 'juan'});
});


// Shows the form to add an apple.
// The <form action> will point to POST /apples

app.get('/apples/:id', (req, res) => {
  let apple = appleDB.get(req.params.id);
  if (apple) {
    res.render('apples/show', {apple: apple, id: req.params.id});
  }
  else {
    res.status(404).send("Apple not found!");
  }
});

app.get('/apples/new', (req, res) => {
  res.render('apples/new');
});



// Receives data posted from /apples/new
app.post('/apples', (req, res) => {
  appleDB.add(req.body);
  res.redirect('/apples');
});


app.get('/apples/:id/edit', (req, res) => {
  let apple = appleDB.get(req.params.id);
  if (apple) {
    res.render('apples/edit', {apple: apple, id: req.params.id});
  }
  else {
    res.status(404).send("Apple not found!");
  }
});


// If we were being striclty RESTful, this would be
// app.update(...), but due to browser's limitations we're doing
// a POST to a different route. The other workaround would be to
// use the `method-override` npm package:
// https://github.com/expressjs/method-override
app

  .post('/apples/update', (req, res) => {
  let id = req.body.id;
  let editedApple = {
    type: req.body.type,
    color: req.body.color
  };
  appleDB.update(id, editedApple);
  res.redirect("/apples");
})

  .put('/apples/:id')

/*
 * End of routing functions
 */


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
