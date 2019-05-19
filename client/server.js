const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const asyncHandler = require('express-async-handler');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', '*');

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


var jwt = require('jwt-simple');
var base64 = require('base-64');

app.post('/generate', asyncHandler(async (req, res) => {

  // var payload = { foo: 'bar' };
  var payload = req.body;
  var secret = 'tap@2019';

  var token = jwt.encode(payload, secret);

  var encoded = base64.encode(token);

  res.send({
    token: encoded
  });

}));

app.post('/localization', (req, res) => {

  var Request = require("request");

  var header = {
      'AccessKey': '5ddcfa79-650e-4b9b-af363f771211-6a15-4927',
      'Content-Type':'application/json',
      'Accept':'application/json',
      'ApiKeyAuth':'a8fe32e4-2777-4340-9ea512987b23-b436-4d2c'
  };

   Request.get({
       "headers": header,
       "url":"https://storage.bunnycdn.com/goselljslib/json/localization.json",
   }, (error, response) => {
      if(error) {
        return console.dir(error);
   }

      var parseData = JSON.parse(response.body);
      res.send(parseData);
   });

});

const port = 8010;
app.listen(port, () => {
   //console.log('We are live on ' + port);
});
