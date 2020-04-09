import { decorate, observable, computed } from "mobx";
import "bluebird";

class FormStore {
  constructor(RootStore) {
    this.RootStore = RootStore;

    this.currencyCode = null;
    this.lock = false;
    this.tap = null;
    this.card = null;
    this._apiKey = null;
    this._encryption_key = "";
    this.tds = "";
    this.hide = null;
    // added to handle focus/blur of the card frame
    this.submitBtnFlag = false;

    // this.checkFocus = this.checkFocus.bind(this);
    this.generateToken = this.generateToken.bind(this);
  }

  objectToQueryString(obj, prefix) {
    var str = [],
      k,
      v;
    for (var p in obj) {
      if (!obj.hasOwnProperty(p)) {
        continue;
      } // skip things from the prototype
      if (~p.indexOf("[")) {
        k = prefix
          ? prefix +
            "[" +
            p.substring(0, p.indexOf("[")) +
            "]" +
            p.substring(p.indexOf("["))
          : p;
        // only put whatever is before the bracket into new brackets; append the rest
      } else {
        k = prefix ? prefix + "[" + p + "]" : p;
      }
      v = obj[p];
      str.push(
        typeof v == "object"
          ? this.objectToQueryString(v, k)
          : k + "=" + encodeURIComponent(v)
      );
    }
    return str.join("&");
  }

  readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          allText = rawFile.responseText;
        }
      }
    };
    rawFile.send(null);
  }

  generateForm(key, mid = null) {
    var self = this;
    var protocol = "https:";
    var frameurl = "secure.gosell.io/tappaymentwidget/public/";
    function _ensureHTTPS(key) {
      if (window.location.protocol == "http:" && 0 === key.indexOf("pk_live")) {
        throw new Error(
          "goSell integrations must use HTTPS.You're using live public key, which should be used with ssl certificate."
        );
      }
      var e = window.location.protocol,
        t = -1 !== ["https:", "file:"].indexOf(e),
        n =
          -1 !==
          ["localhost", "127.0.0.1", "0.0.0.0"].indexOf(
            window.location.hostname
          ),
        o = "Live goSell integrations must use HTTPS.";
      if (!t) {
        window.console &&
          console.warn(
            "You may test your goSell integration over HTTP. However, live goSell integrations must use HTTPS."
          );
      } else {
        window.console && console.warn(o);
      }
    }

    if ("" === key)
      throw new Error(
        "Please call goSell() with your publishable key. You used an empty string."
      );
    if (0 === key.indexOf("sk_"))
      throw new Error(
        "You should not use your secret key with goSell.\n        Please pass a publishable key instead."
      );
    _ensureHTTPS(key);

    try {
      self._apiKey = key;
      self._mid = mid;
      self._encryption_key = "sdfds";
    } catch (e) {
      //throw new Error("Please use valid tap js config json file");
    }

    self.getInfo = function() {
      return this;
    };
    self.statusFocus = function(card, result) {};
    self.createToken = function(card, result) {
      if (self.lock == true) {
        ////console.log('wait')
        return;
      }

      self.lock = true;

      return new Promise(function(resolve, reject) {
        var iframeWin = document.getElementById("myFrame").contentWindow;
        iframeWin.postMessage(
          {
            action: "submit",
            key: self._apiKey,
            encryption_key: self._encryption_key,
          },
          protocol + "//" + frameurl + "/tap_payment_widget_ui"
        );

        window.addEventListener("message", receivertoken, false);

        function receivertoken(e) {
          if (this.card) {
            var iframe_obj = this.card._iframe;
          } else {
            var iframe_obj = document.getElementById("myFrame");
          }

          if (iframe_obj != null) {
            var i_obj = iframe_obj.getAttribute("src");

            if (0 === i_obj.indexOf(e.origin)) {
              //////console.log(e.data);
              if (e.data.error) {
                self.lock = false;
                resolve(e.data);
              }

              if (e.data.type == "token" && e.data.data) {
                self.lock = false;
                resolve(e.data.data.result);
              }
              if (e.data.type == "token") {
                self.lock = false;
                resolve(e.data);
              }
            }
          }
        }
      });
    };
    self.elements = function(options) {
      this.elements.card = {};
      this.elements.card.getCurrency = function() {
        return self.currencyCode;
      };
      self.elements.card.currency = function(crncy) {
        return new Promise(function(resolve, reject) {
          if (document.getElementById("myFrame") != null) {
            self.currencyCode = crncy;
            var iframeWin = document.getElementById("myFrame").contentWindow;
            iframeWin.postMessage(
              { action: "currency", key: self._apiKey, currency: crncy },
              protocol + "//" + frameurl + "/tap_payment_widget_ui"
            );
          }
        });
      };

      self.elements.card.clearForm = function() {
        return new Promise(function(resolve, reject) {
          if (document.getElementById("myFrame") != null) {
            var iframeWin = document.getElementById("myFrame").contentWindow;
            iframeWin.postMessage(
              { action: "clearForm", key: self._apiKey },
              protocol + "//" + frameurl + "/tap_payment_widget_ui"
            );
          }
        });
      };
      self.elements.card.blurForm = function() {
        var input = document.createElement("input");
        input.setAttribute("type", "text");
        var parent = document.body;
        parent.appendChild(input);
        input.focus();
        input.blur();
        input.parentNode.removeChild(input);
        return new Promise(function(resolve, reject) {
          if (document.getElementById("myFrame") != null) {
            var iframeWin = document.getElementById("myFrame").contentWindow;
            iframeWin.postMessage(
              { action: "blurForm", key: self._apiKey },
              protocol + "//" + frameurl + "/tap_payment_widget_ui"
            );
          }
        });
      };
      self.elements.card.mount = function(id) {
        var s = document.querySelector(id);
        if (s) {
          //s.parentNode.style.maxWidth="400px";
          var d = document.createElement("div");
          d.setAttribute("id", "privateTapElement");
          d.setAttribute(
            "style",
            "height:inherit;margin: 0px !important; padding: 0px !important; border: medium none !important; display: block !important; background: transparent none repeat scroll 0% 0% !important; position: relative !important; opacity: 1 !important; width:100%;"
          );

          s.appendChild(d);
          d.appendChild(this._iframe);
        }
      };
      self.elements.card.addEventListener = function(id, res) {
        // //console.log('card id', id);
        window.addEventListener("message", receiver, false);
        //////console.log(this)
        if (this.card) {
          var iframe_obj = this.card._iframe;
        } else {
          var iframe_obj = document.getElementById("myFrame");
        }

        function receiver(e) {
          //if (0 === self.card._iframe.src.indexOf(e.origin)){
          if (iframe_obj && 0 === iframe_obj.src.indexOf(e.origin)) {
            /*//console.log("received in js library");
                      //console.log(e.data);*/
            if (e.data.layout) {
              var iframeWin = document.getElementById("myFrame");
              //iframeWin.setAttribute("height","140px");
              iframeWin.setAttribute("height", e.data.layout.height);
              res({ loaded: true });

              self.RootStore.apiStore.getIP().then((ip) => {
                console.log("ip", ip);
                var iframeWin = document.getElementById("myFrame")
                  .contentWindow;
                iframeWin.postMessage(
                  { action: "client_ip", key: self._apiKey, client_ip: ip },
                  protocol + "//" + frameurl + "/tap_payment_widget"
                );
              });
            }
            if (
              e.data.success == true &&
              e.data.BIN &&
              e.data.type != "token"
            ) {
              self.tds = e.data;
              res(e.data);
            } else {
              res(e.data);
            }
          }
        }
      };

      self.elements.create = function(type, options_object, paymentOptions) {
        this.card.type = type;

        var x = document.createElement("IFRAME");
        x.setAttribute("id", "myFrame");
        x.setAttribute("name", "myFrame");
        x.setAttribute("title", "Secure payment input");
        x.setAttribute("allowpaymentrequest", "true");

        x.setAttribute(
          "style",
          "border: none !important;margin: 0px !important;padding: 0px !important;min-width: 100% !important;overflow: hidden !important;display: block !important;"
        );

        x.setAttribute(
          "src",
          protocol +
            "//" +
            frameurl +
            "/tap_payment_widget_ui?" +
            self.objectToQueryString(options_object) +
            "&mid=" +
            mid +
            "&key=" +
            key +
            "&" +
            self.objectToQueryString(paymentOptions)
        );

        this.card._iframe = x;
        self.currencyCode = paymentOptions.currencyCode;

        return this.card;
      };
      this.elements.options = options;
      return this.elements;
    };

    return this;
  }

  generateCardForm(id) {
    var self = this;

    var merchant_id =
      self.RootStore.configStore.config.gateway &&
      self.RootStore.configStore.config.gateway.merchantId
        ? self.RootStore.configStore.config.gateway.merchantId
        : null;

    this.tap = this.generateForm(
      this.RootStore.configStore.gateway.publicKey,
      merchant_id
    );

    var elements = this.tap.elements({});

    var style = this.RootStore.configStore.style;

    var paymentOptions = {
      currencyCode: this.RootStore.configStore.gateway.supportedCurrencies.slice(),
      labels: this.RootStore.configStore.gateway.labels,
      paymentAllowed: this.RootStore.configStore.gateway.supportedPaymentMethods.slice(),
      TextDirection:
        this.RootStore.configStore.gateway.language == "en" ? "ltr" : "rtl",
    };

    this.card = elements.create("card", { style: style }, paymentOptions);
    this.card.mount("#" + id);

    this.card.addEventListener("change", function(event) {
      // //console.log('change event', event);
      self.onChange(event);
    });
  }

  onChange(event) {
    var self = this;
    var bin = true;
    var active_brand = null;

    if (event.error && event.error.code == 400) {
      self.RootStore.uIStore.setErrorHandler({
        visable: true,
        code: event.error.code,
        msg: self.RootStore.localizationStore.getContent(event.error.key, null),
        type: "warning",
      });
    } else if (
      event.code == 400 ||
      (event.error_interactive && event.error_interactive.code == 400)
    ) {
      //console.log('event code 400');
      //console.log('code', event.error_interactive.code);

      if (event.error_interactive.key === "cvv_digit_required") {
        var msg = self.RootStore.localizationStore
          .getContent(event.error_interactive.key, null)
          .replace("<digit>", event.error_interactive.digit);
      } else {
        var msg = self.RootStore.localizationStore.getContent(
          event.error_interactive.key,
          null
        );
      }

      if (event.error_interactive) {
        self.RootStore.uIStore.setErrorHandler({
          visable: true,
          code: event.error_interactive.code,
          msg: msg,
          type: "error",
        });
      }

      if (
        event.error &&
        event.error.code &&
        (event.error.code === 409 || event.error.code === 403)
      ) {
        //hide form here
        self.hide = true;

        if (event.error.code === 403) {
          if (event.error.key === "cvv_digit_required") {
            var msg = self.RootStore.localizationStore
              .getContent(event.error.key, null)
              .replace("<digit>", event.error.digit);
          } else {
            var msg = self.RootStore.localizationStore.getContent(
              event.error.key,
              null
            );
          }

          self.RootStore.uIStore.setErrorHandler({
            visable: true,
            code: event.error.code,
            msg: event.error.message,
            type: "warning",
          });
        }
      } else {
        self.hide = false;
      }
    }
    if (event.BIN && event.BIN.card_brand !== active_brand) {
      active_brand = event.BIN.card_brand;
    }
  }

  async generateToken() {
    var self = this;

    await self.tap.createToken(self.card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error
        self.RootStore.uIStore.setErrorHandler({
          visable: true,
          code: 0,
          msg: self.RootStore.localizationStore.getContent(
            result.error.key,
            null
          ),
          type: "error",
        });
      } else {
        self.RootStore.uIStore.setErrorHandler({});

        self.RootStore.configStore.callbackFunc(result);

        // self.RootStore.uIStore.setErrorHandler({
        //        visable: true,
        //        code: 200,
        //        msg: result.id,
        //        type: 'success'
        // });

        self.clearCardForm();
      }
    });
  }

  clearCardForm() {
    if (this.card != null) {
      this.card.clearForm();
      this.card.blurForm();
    }
  }
}

decorate(FormStore, {
  lock: observable,
  currencyCode: observable,
  tap: observable,
  card: observable,
});

export default FormStore;
