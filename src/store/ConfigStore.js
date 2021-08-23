import * as mobx from "mobx";
import Paths from "../../webpack/paths";

class ConfigStore {
  constructor(RootStore) {
    this.RootStore = RootStore;
    this.reset();
    this.getAppDetails();
  }

  reset() {
    this.config = null;
    this.oldConfig = null;
    this.gateway = {};
    this.language = "en";

    this.style = {
      base: {
        color: "#535353",
        lineHeight: "18px",
        fontFamily: this.language === "en" ? "Roboto-Light" : "Helvetica-Light",
        fontUrl:
          this.language === "en"
            ? Paths.cssPath + "fontsEn.css"
            : Paths.cssPath + "fontsAr.css",
        fontSmoothing: "antialiased",
        fontSize: "15px",
        "::placeholder": {
          color: "rgba(0, 0, 0, 0.26)",
          fontSize: this.language === "en" ? "15px" : "10px",
        },
      },
      invalid: {
        color: "red",
        iconColor: "#fa755a ",
      },
    };

    this.browser = null;
    this.os = null;
    this.navigator = null;

    this.token = null;
    this.notifications = "standard";
    this.redirect_url = null;
  }

  callbackFunc(data) {
    if (this.RootStore.configStore.gateway.callback) {
      this.RootStore.configStore.gateway.callback(data);
    }
  }

  getAppDetails() {
    var module = {
      options: [],
      header: [
        navigator.platform,
        navigator.userAgent,
        navigator.appVersion,
        navigator.vendor,
        window.opera,
      ],
      dataos: [
        { name: "Windows Phone", value: "Windows Phone", version: "OS" },
        { name: "Windows", value: "Win", version: "NT" },
        { name: "iPhone", value: "iPhone", version: "OS" },
        { name: "iPad", value: "iPad", version: "OS" },
        { name: "Kindle", value: "Silk", version: "Silk" },
        { name: "Android", value: "Android", version: "Android" },
        { name: "PlayBook", value: "PlayBook", version: "OS" },
        { name: "BlackBerry", value: "BlackBerry", version: "/" },
        { name: "Macintosh", value: "Mac", version: "OS X" },
        { name: "Linux", value: "Linux", version: "rv" },
        { name: "Palm", value: "Palm", version: "PalmOS" },
      ],
      databrowser: [
        { name: "Chrome", value: "Chrome", version: "Chrome" },
        { name: "Firefox", value: "Firefox", version: "Firefox" },
        { name: "Safari", value: "Safari", version: "Version" },
        { name: "Internet Explorer", value: "MSIE", version: "MSIE" },
        { name: "Opera", value: "Opera", version: "Opera" },
        { name: "BlackBerry", value: "CLDC", version: "CLDC" },
        { name: "Mozilla", value: "Mozilla", version: "Mozilla" },
      ],
      init: function() {
        var agent = this.header.join(" "),
          os = this.matchItem(agent, this.dataos),
          browser = this.matchItem(agent, this.databrowser);

        return { os: os, browser: browser };
      },
      matchItem: function(string, data) {
        var i = 0,
          j = 0,
          html = "",
          regex,
          regexv,
          match,
          matches,
          version;

        for (i = 0; i < data.length; i += 1) {
          regex = new RegExp(data[i].value, "i");
          match = regex.test(string);
          if (match) {
            regexv = new RegExp(data[i].version + "[- /:;]([\\d._]+)", "i");
            matches = string.match(regexv);
            version = "";
            if (matches) {
              if (matches[1]) {
                matches = matches[1];
              }
            }
            if (matches) {
              matches = matches.split(/[._]+/);
              for (j = 0; j < matches.length; j += 1) {
                if (j === 0) {
                  version += matches[j] + ".";
                } else {
                  version += matches[j];
                }
              }
            } else {
              version = "0";
            }
            return {
              name: data[i].name,
              version: parseFloat(version),
            };
          }
        }
        return { name: "unknown", version: 0 };
      },
    };

    var e = module.init();

    this.browser = e.browser;
    this.os = e.os;
    this.navigator = navigator;

    this.app = {
      app_locale: this.language,
      requirer: "web.checkout",
      app_id: "gosell.checkout.web",
      app_client_version: "1.6.2",
      app_server_version: "1.6.2",
      requirer_os: this.os != null ? this.os.name : "unknown",
      requirer_os_version: this.os != null ? this.os.version : "unknown",
      requirer_browser: this.browser != null ? this.browser.name : "unknown",
      requirer_browser_version:
        this.browser != null ? this.browser.version : "unknown",
      user_agent: this.navigator != null ? this.navigator.userAgent : "unknown",
    };

    console.log("app ==> ", this.app);
  }

  setConfig(value, view) {
    var self = this;

    this.config = value;
    this.oldConfig = JSON.stringify(mobx.toJS(this.config));

    this.config = Object.assign({}, value);
    this.config["location"] = {
      protocol: window.location.protocol,
      host: window.location.host,
      path: window.location.pathname,
    };

    // this.getAppDetails();

    this.config["app"] = this.app;

    console.log("config", this.config);

    if (value.gateway) {
      this.language = value.gateway.language ? value.gateway.language : "en";

      if (value.gateway.labels) {
        this.labels = {
          cardNumber: value.gateway.labels.cardNumber
            ? value.gateway.labels.cardNumber
            : this.RootStore.localizationStore.getContent(
                "card_input_card_number_placeholder",
                null
              ),
          expirationDate: value.gateway.labels.expirationDate
            ? value.gateway.labels.expirationDate
            : this.RootStore.localizationStore.getContent(
                "card_input_expiration_date_placeholder",
                null
              ),
          cvv: value.gateway.labels.cvv
            ? value.gateway.labels.cvv
            : this.RootStore.localizationStore.getContent(
                "card_input_cvv_placeholder",
                null
              ),
          cardHolder: value.gateway.labels.cardHolder
            ? value.gateway.labels.cardHolder
            : this.RootStore.localizationStore.getContent(
                "card_input_cardholder_name_placeholder",
                null
              ),
        };
      } else {
        this.labels = {
          cardNumber: this.RootStore.localizationStore.getContent(
            "card_input_card_number_placeholder",
            null
          ),
          expirationDate: this.RootStore.localizationStore.getContent(
            "card_input_expiration_date_placeholder",
            null
          ),
          cvv: this.RootStore.localizationStore.getContent(
            "card_input_cvv_placeholder",
            null
          ),
          cardHolder: this.RootStore.localizationStore.getContent(
            "card_input_cardholder_name_placeholder",
            null
          ),
        };
      }

      this.style = {
        base:
          value.gateway.style && value.gateway.style.base
            ? value.gateway.style.base
            : {
                color: "#535353",
                lineHeight: "18px",
                fontFamily:
                  this.language === "en" ? "Roboto-Light" : "Helvetica-Light",
                fontUrl:
                  this.language === "en"
                    ? Paths.cssPath + "fontsEn.css"
                    : Paths.cssPath + "fontsAr.css",
                fontSmoothing: "antialiased",
                fontSize: "15px",
                "::placeholder": {
                  color: "rgba(0, 0, 0, 0.26)",
                  fontSize: "15px",
                },
              },
        invalid:
          value.gateway.style && value.gateway.style.invalid
            ? value.gateway.style.invalid
            : {
                color: "red",
                iconColor: "#fa755a ",
              },
      };
    }

    var gatewayObj = value.gateway
      ? {
          publicKey: value.gateway.publicKey ? value.gateway.publicKey : null,
          merchantId: value.gateway.merchantId
            ? value.gateway.merchantId
            : null,
          contactInfo:
            typeof value.gateway.contactInfo != "undefined"
              ? value.gateway.contactInfo
              : true,
          customerCards:
            typeof value.gateway.customerCards != "undefined"
              ? value.gateway.customerCards
              : true,
          language: value.gateway.language ? value.gateway.language : "en",
          notifications: value.gateway.notifications
            ? value.gateway.notifications
            : "standard",
          callback: value.gateway.callback ? value.gateway.callback : null,
          onClose: value.gateway.onClose ? value.gateway.onClose : null,
          onLoad: value.gateway.onLoad ? value.gateway.onLoad : null,
          backgroundImg: value.gateway.backgroundImg
            ? value.gateway.backgroundImg
            : null,
          saveCardOption:
            typeof value.gateway.saveCardOption != "undefined"
              ? value.gateway.saveCardOption
              : true,
          supportedCurrencies: value.gateway.supportedCurrencies
            ? value.gateway.supportedCurrencies
            : "all",
          supportedPaymentMethods: value.gateway.supportedPaymentMethods
            ? value.gateway.supportedPaymentMethods
            : "all",
          labels: value.gateway.labels ? value.gateway.labels : this.labels,
          style: value.gateway.style ? value.gateway.style : this.style,
        }
      : {};

    this.config.gateway = gatewayObj;
    this.gateway = gatewayObj;

    var transaction_mode = this.config.transaction
      ? this.config.transaction.mode
      : null;

    this.notifications =
      value.gateway && value.gateway.notifications
        ? value.gateway.notifications
        : "standard";

    if (view === "GOSELL") {
      switch (transaction_mode) {
        case "charge":
          if (self.config.transaction.charge) {
            self.redirect_url =
              self.config.transaction.charge.redirect &&
              self.config.transaction.charge.redirect != null
                ? self.config.transaction.charge.redirect
                : window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname;

            self.config.transaction.charge.redirect = self.redirect_url;
            console.log("redirect", self.redirect_url);

            self.RootStore.apiStore.generateToken(this.config).then((obj) => {
              self.token = obj.token;
              console.log("token", this.token);
            });
          }

          break;
        case "authorize":
          if (self.config.transaction.authorize) {
            self.redirect_url =
              self.config.transaction.authorize.redirect &&
              self.config.transaction.authorize.redirect == null
                ? self.config.transaction.authorize.redirect
                : window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname;

            self.config.transaction.authorize.redirect = self.redirect_url;
            console.log("redirect", self.redirect_url);

            self.RootStore.apiStore.generateToken(this.config).then((obj) => {
              self.token = obj.token;
              console.log("token", this.token);
            });
          }
          break;
      }
    }
  }
}

mobx.decorate(ConfigStore, {
  config: mobx.observable,
  token: mobx.observable,
  notifications: mobx.observable,
  gateway: mobx.observable,
  redirect_url: mobx.observable,
  language: mobx.observable,
  app: mobx.observable,
  oldConfig: mobx.observable,
});

export default ConfigStore;
