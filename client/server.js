const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.setHeader('Content-Type', 'application/json;charset=UTF-8');

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");


    // Pass to next layer of middleware
    next();

});


app.post('/key', (req, res) => {

  var Request = require("request");

  var mode = req.body.mode === 'Development' ? 'http://35.194.57.148:8080' : 'https://api.tap.company';
  var requestbody = req.body.reqBody ? req.body.reqBody : {};

  Request.post({
    "headers": req.body.headers,
    "url": mode + "/v2/js_library/auth",
    "body": JSON.stringify(requestbody)
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        res.send(response.body);
    });

});


app.post('/api', (req, res) => {

  var Request = require("request");

  var mode = req.body.mode === 'Development' ? 'http://35.194.57.148:8080' : 'https://api.tap.company';
  var requestbody = req.body.reqBody ? JSON.stringify(req.body.reqBody) : JSON.stringify({});

  if(req.body.method.toLowerCase() === 'post'){
    Request.post({
    "headers": req.body.headers,
    "url": mode + req.body.path,
    "body": requestbody}, (error, response, body) => {
        if(error) {
            res.send(error);
        }
        console.log('body', req.body.headers);
        res.send(response);
    });
  }
  else if(req.body.method.toLowerCase() === 'get'){

    Request.get({
    "headers": req.body.headers,
    "url": mode + req.body.path}, (error, response) => {
        if(error) {
            res.send(error);
        }
        console.log('get path', mode + req.body.path);
        console.log('get header', req.body.headers);
        res.send(response);
    });
  }


});
/*
app.get('/api/:mode/:headers', (req, res) => {

  var Request = require("request");
  var mode = req.params.mode === 'Development' ? 'http://35.194.57.148:8080' : 'https://api.tap.company';

  Request.get({
  "headers": req.params.headers,
  "url": mode + req.params.path}, (error, response) => {
      if(error) {
          res.send(error);
      }
      res.send(response);
  });

});*/


//require('./routes')(app, {});

const port = 8000;
app.listen(port, () => {
  console.log('We are live on ' + port);
});