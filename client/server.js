const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const jwtJsDecode    = require('jwt-js-decode');

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


function checkJWTExpiry(session) {
  try{
    const jwt = jwtJsDecode.jwtDecode(session);
    console.log('jwt', jwt);
    // console.log(jwt.payload);
    const currentDate = Date.now()/1000;
    // console.log('time', currentDate);
    const time = jwt.payload.exp;
    //jwt.payload.exp
    if (time >= currentDate) {
      return  true;
    } else {
      return  false;
    }
  }
  catch(error) {
    console.error(error);
    return  false;
  }
}


app.post('/init', (req, res) => {

  console.log(req);
  var Request = require("request");

  var mode = req.body.mode === 'Development' ? 'http://35.194.57.148:8080' : 'https://api.tap.company';

  var requestbody = req.body.reqBody ? req.body.reqBody : {};
  var header = Object.assign({}, req.body.headers,
    {
      "access_key": "ak_XKokBfNWv6FIYuTMg5sLPjhJ",
      'Content-Type': 'application/json',
      "Application":"app_locale=en_UA|requirer=checkout|app_id=company.tap.checkout|requirer_os=pc|requirer_version=2.0.0|requirer_os_version=11.3"
    });

    Request.get({
      "headers": req.body.headers,
      "url": mode + "/v2/init",
    }, (error, response) => {
      if(error) {
        return console.dir(error);
      }

      var parseData = JSON.parse(response.body);
      console.log('response ..... ', response.body);
      // global.session = JSON.parse(response.body).data.session_token;
      // global.key = JSON.parse(response.body).data.encryption_key;

      res.send({
        status:parseData.status,
        data:{
          merchant:parseData.data.merchant,
          permission:parseData.data.permission,
          sdk_settings:parseData.data.sdk_settings,
          session_token:parseData.data.session_token
        }
      });
    });

  });


  app.post('/api', (req, res) => {
    // console.log(
    //   "%c/API REQUEST",
    //   "background: maroon; color: white; display: block;"
    // );

    var Request = require("request");

    var mode = req.body.mode === 'Development' ? 'http://35.194.57.148:8080' : 'https://api.tap.company';

    var header = Object.assign({}, req.body.headers,
      {
        'Content-Type': 'application/json',
        "Application":"app_locale=en_UA|requirer=checkout|app_id=company.tap.checkout|requirer_os=pc|requirer_version=2.0.0|requirer_os_version=11.3"
      });


      var requestbody = req.body.reqBody ? JSON.stringify(req.body.reqBody) : JSON.stringify({});

      var session = checkJWTExpiry(req.body.headers.session_token);
      // console.log('session', session);

      if(session){

        console.log(
          "%cVALID SESSION",
          "color: green; display: block;"
        );
        // console.log('checkJWTExpiry >>>>>>>>>>>>>>>>>>>>>>>>>> ', checkJWTExpiry());

        if(req.body.method.toLowerCase() === 'post'){
          console.log(
            "%c/POST  "+ req.body.path,
            "background: pink; color: white; display: block;"
          );
          Request.post({
            "headers": header,
            "url": mode + req.body.path,
            "body": requestbody}, (error, response, body) => {
              if(error) {
                res.send(error);
              }
              // console.log(
              //   "%c/response",
              //   "background: blue; color: white; display: block;"
              // );
              // console.log(response.body);
              res.send(response.body);
            });
          }
          else if(req.body.method.toLowerCase() === 'get'){
            console.log(
              "%c/GET  "+ req.body.path,
              "background: pink; color: white; display: block;"
            );
            Request.get({
              "headers": header,
              "url": mode + req.body.path}, (error, response) => {
                if(error) {
                  res.send(error);
                }

              // console.log(
              //   "%c/response",
              //   "background: blue; color: white; display: block;"
              // );
              // console.log(response.body);
                res.send(response.body);
              });
            }
            else if(req.body.method.toLowerCase() === 'put'){
              console.log(
                "%c/PUT  "+ req.body.path,
                "background: pink; color: white; display: block;"
              );
              Request.put({
                "headers": header,
                "url": mode + req.body.path,
                "body": requestbody
              }, (error, response, body) => {
                if(error) {
                  res.send(error);
                }

              // console.log(
              //   "%c/response",
              //   "background: blue; color: white; display: block;"
              // );
              // console.log(response.body);
                res.send(response.body);
              });

            }
            else if(req.body.method.toLowerCase() === 'delete'){
              console.log(
                "%c/DELETE  "+ req.body.path,
                "background: pink; color: white; display: block;"
              );
              Request.delete({
                "headers": header,
                "url": mode + req.body.path}, (error, response) => {
                  if(error) {
                    res.send(error);
                  }

                // console.log(
                //   "%c/response",
                //   "background: blue; color: white; display: block;"
                // );
                // console.log(response.body);
                  res.send(response.body);
                });
              }

            }
            else {
              var err = {
                error: {'code': 99999, 'description': 'Session has been expired!'}
              };
              res.send(err);
            }
          });


          app.post('/localization', (req, res) => {

            console.log(req);
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
                console.log('response ..... ', response.body);
                res.send(parseData);
              });

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
