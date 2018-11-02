import React, { Component }  from 'react';
import config from '../assets/json/tap_js_config_secure.json';

class CardsForm extends Component {

  constructor(props){
    super(props);

    this.state = {}
  }

  componentDidMount () {

      const script = document.createElement("script");

      script.src = "https://use.typekit.net/foobar.js";
      script.async = true;

      document.body.appendChild(script);

      var tap = Tapjsli(config);

      var elements = tap.elements({});
      var style = {
        base: {
          color: 'black',
          lineHeight: '18px',
          fontFamily: '"Serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: 'red',
          iconColor: '#fa755a'
        }
      };

      var labels = {

      };

      var paymentOptions = {
        currencyCode:"KWD",
        labels : {
          cardNumber:"Card Number",
          expirationDate:"MM/YY",
          cvv:"CVV",
          cardHolder:"Card Holder Name"
        },
        TextDirection:'ltr'
      }

      var card = elements.create('card', {style: style},paymentOptions);

      card.mount('#element-container');

      card.addEventListener('change', function(event) {
        //console.log(event);
        var displayError = document.getElementById('error-handler');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });

      // Handle form submission
      var form = document.getElementById('form-container');
      form.addEventListener('submit', function(event) {
        event.preventDefault();

        tap.createToken(card).then(function(result) {
          //console.log(result);
          if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('error-handler');
            errorElement.textContent = result.error.message;
          } else {
            // Send the token to your server
            var errorElement = document.getElementById('success');
            errorElement.style.display = "block";
            var tokenElement = document.getElementById('token');
            tokenElement.textContent = result.id;

            console.log(result.id);
          }
        });
      });
  }

  render() {

    return (
      <form id="form-container" method="post" action="/charge">
          <div id="element-container"></div>
          <div id="error-handler" role="alert"></div>
          <div id="success" style=" display: none;;position: relative;float: left;">
            Success! Your token is <span id="token"></span>
          </div>
          <button id="tap-btn">Submit</button>
      </form>
    );
  }
}

export default CardsForm;
