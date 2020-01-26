import { decorate, observable } from "mobx";
import axios from "axios";
import Paths from "../../webpack/paths";

class ApplePayStore {
  constructor(RootStore) {
    this.RootStore = RootStore;

    this.merchantIdentifier = "merchant.tap.gosell";

    this.checkAvailability = this.checkAvailability.bind(this);
    this.openPaymentSetup = this.openPaymentSetup.bind(this);
    this.requestPayment = this.requestPayment.bind(this);

    this.performValidation = this.performValidation.bind(this);
    this.sendPaymentToken = this.sendPaymentToken.bind(this);

    this.reset();
  }

  reset() {
    this.publicKey = null;
    this.language = "en";
    this.merchantName = "anything";
    this.session_token = null;
    this.origin = window.location.origin;

    this.request = {
      countryCode: "SR",
      currencyCode: "SAR",
      supportedNetworks: ["visa", "mastercard"],
      merchantCapabilities: ["supports3DS"],
      total: {
        label: "ANYTHING",
        amount: 100
      }
    };

    this.buttonType = "plain";
    this.buttonStyle = {};

    this.app = {
      app_locale: this.language,
      requirer: "web.checkout",
      app_id: "gosell.checkout.web",
      app_client_version: "1.5.4",
      app_server_version: "1.5.4",
      requirer_os: "unknown",
      requirer_os_version: "unknown",
      requirer_browser: "unknown",
      requirer_browser_version: "unknown"
    };

    this.client_ip = "168.187.107.155";
  }

  checkAvailability() {
    var applePaySession = window.ApplePaySession;

    if (applePaySession) {
      console.log("Can make payment! ");
      ApplePaySession.canMakePaymentsWithActiveCard(
        this.merchantIdentifier
      ).then(function(canMakePayments) {
        if (canMakePayments) {
          // Display Apple Pay Buttons here…
          document.getElementById("apple-pay-btn").style.display = "block";
        } else {
          // Check for the existence of the openPaymentSetup method.
          this.openPaymentSetup();
          // document.getElementById("apple-pay-btn").style.display = "none";
        }
      });
    } else {
      console.log("Can't make payment! ");
      document.getElementById("apple-pay-btn").style.display = "none";
      this.RootStore.configStore.callbackFunc({
        msg: "Can't make payment! Apple Pay is supported Safari browser only. "
      });
    }
  }

  openPaymentSetup() {
    var self = this;
    // Check for the existence of the openPaymentSetup method.
    if (ApplePaySession.openPaymentSetup) {
      // Display the Set up Apple Pay Button here…
      ApplePaySession.openPaymentSetup(self.merchantIdentifier)
        .then(function(success) {
          if (success) {
            // Open payment setup successful
            console.log("Open payment setup successful");
            self.RootStore.configStore.callbackFunc({
              msg: "Open payment setup successful "
            });
          } else {
            // Open payment setup failed
            console.log("Open payment setup failed");
            self.RootStore.configStore.callbackFunc({
              msg: "Open payment setup failed"
            });
          }
        })
        .catch(function(e) {
          // Open payment setup error handling
          self.RootStore.configStore.callbackFunc({
            msg: "Open payment setup error handling"
          });

          console.log("Open payment setup error handling", e);
        });
    }
  }

  requestPayment() {
    var self = this;
    console.log("request payment");

    var request = self.request;

    console.log("request ==> ", request);

    var session = new ApplePaySession(1, request);
    console.log("parent session ===> ", session);

    // Merchant Validation
    session.onvalidatemerchant = event => {
      //console.log(event);
      console.log("event: ", event);
      console.log("validationURL: ", event.validationURL);

      var promise = self
        .performValidation(event.validationURL)
        .then(merchantSession => {
          console.log("merchant session: ", merchantSession);
          session.completeMerchantValidation(merchantSession);
          // console.log("end = " + window.location.host);
        });
    };

    session.onpaymentmethodselected = event => {
      var total = {
        type: "final",
        label: this.request.total.label,
        amount: this.request.total.amount
      };

      var items = [];

      session.completePaymentMethodSelection(total, items);
    };

    session.onpaymentauthorized = event => {
      console.log(event);

      var promise = self.sendPaymentToken(event.payment.token.paymentData);

      promise.then(function(success) {
        var status;
        if (success) {
          status = ApplePaySession.STATUS_SUCCESS;
          // document.getElementById("applePay").style.display = "none";
          // document.getElementById("success").style.display = "block";
        } else {
          status = ApplePaySession.STATUS_FAILURE;
        }

        console.log("result of sendPaymentToken() function =  " + success);
        session.completePayment(status);
      });
    };

    session.oncancel = e => {
      console.log("starting session.cancel", e);
      self.RootStore.configStore.callbackFunc({
        msg: "Session cancelled: " + e
      });
    };

    session.begin();
  }

  performValidation(valURL) {
    var self = this;
    var header = {
      "Content-Type": "application/json"
    };

    console.log("origin for session ===> ", this.origin);

    var body = {
      validationUrl: valURL,
      merchantIdentifier: this.merchantIdentifier,
      merchantName: this.merchantName,
      origin: this.origin
    };

    return new Promise(function(resolve, reject) {
      axios
        .post(Paths.serverPath + "/session", body)
        .then(function(response) {
          console.log("apple session ::::::::::: ", response.data);
          resolve(response.data);
        })
        .catch(function(error) {
          console.log("error", error);
          resolve(error);
          self.RootStore.configStore.callbackFunc(error);
        });
    });
  }

  sendPaymentToken(paymentToken) {
    var self = this;
    //this is where you would pass the payment token to your third-party payment provider to use the token to charge the card. Only if your provider tells you the payment was successful should you return a resolve(true) here. Otherwise reject
    //defaulting to resolve(true) here, just to show what a successfully completed transaction flow looks like
    // var tokenObj = JSON.stringify(paymentToken);
    console.log("paymentToken =====> ", paymentToken);

    var app = this.app;
    var location = {
      protocol: window.location.protocol,
      host: window.location.host,
      path: window.location.pathname
    };

    var body = {
      mode: "Production",
      method: "POST",
      path: "/v2/token",
      location: location,
      headers: {
        session_token: this.session_token,
        Application:
          "app_locale=" +
          app.app_locale +
          "|requirer=" +
          app.requirer +
          "|app_id=" +
          app.app_id +
          "|app_client_version=" +
          app.app_client_version +
          "|app_server_version=" +
          app.app_server_version +
          "|requirer_os=" +
          app.requirer_os +
          "|requirer_os_version=" +
          app.requirer_os_version +
          "|requirer_browser=" +
          app.requirer_browser +
          "|requirer_browser_version=" +
          app.requirer_browser_version
      },
      reqBody: {
        type: "applepay",
        token_data: paymentToken,
        client_ip: this.client_ip
      }
    };

    return new Promise(function(resolve, reject) {
      // console.log('starting function sendPaymentToken()');
      // console.log(paymentToken);

      axios
        .post(Paths.serverPath + "/api", body)
        .then(function(response) {
          var response = response.data;
          console.log("tap token ::::::::::: ", response);

          if (response.id) {
            self.RootStore.apiStore
              .handleTransaction(response.id, "applepay", 0.0)
              .then(result => {
                self.RootStore.configStore.callbackFunc(result);
                resolve(true);
              });
          } else {
            self.RootStore.configStore.callbackFunc(response);
            resolve(false);
          }
        })
        .catch(function(error) {
          console.log("error", error);
          self.RootStore.configStore.callbackFunc(error);
          resolve(false);
        });
    });
  }
}

decorate(ApplePayStore, {
  merchantIdentifier: observable
});

export default ApplePayStore;
