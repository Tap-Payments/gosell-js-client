import {decorate, observable, computed} from 'mobx';
import 'bluebird';

class FormStore{

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.currencyCode = null;
    this.lock = false;
    this.tap = null;
    this.card = null;
    this._apiKey = null;
    this._encryption_key = '';
    this.tds = '';
    this.hide = null;
    // added to handle focus/blur of the card frame
    this.submitBtnFlag  = false;

    // this.checkFocus = this.checkFocus.bind(this);
    this.generateToken = this.generateToken.bind(this);
  }

  objectToQueryString(obj, prefix) {
      var str = [], k, v;
      for(var p in obj) {
          if (!obj.hasOwnProperty(p)) {continue;} // skip things from the prototype
          if (~p.indexOf('[')) {
              k = prefix ? prefix + "[" + p.substring(0, p.indexOf('[')) + "]" + p.substring(p.indexOf('[')) : p;
              // only put whatever is before the bracket into new brackets; append the rest
          } else {
              k = prefix ? prefix + "[" + p + "]" : p;
          }
          v = obj[p];
          str.push(typeof v == "object" ?
            this.objectToQueryString(v, k) :
            (k) + "=" + encodeURIComponent(v));
      }
      return str.join("&");
  }

  readTextFile(file)
  {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
  }


  detect_details(){
      return new Promise(function(resolve, reject) {
         var xhttp = new XMLHttpRequest();

          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                return resolve(
                    {
                        ip:JSON.parse(this.responseText).ip
                    }
                );


            }
          };
          xhttp.open("GET", "//partners.payments.tap.company/api/v1.3/iploc.aspx", true);
          xhttp.send();
     });
  }

  generateForm(key){
      var self = this;

      var frameurl="secure.gosell.io/tappaymentwidget/public/"
      function _ensureHTTPS(key){

          if (window.location.protocol=='http:' && 0 === key.indexOf("pk_live")){
           throw new Error("goSell integrations must use HTTPS.You're using live public key, which should be used with ssl certificate.");
          }
          var e = window.location.protocol,
          t = -1 !== ["https:", "file:"].indexOf(e),
          n = -1 !== ["localhost", "127.0.0.1", "0.0.0.0"].indexOf(window.location.hostname),
          o = "Live goSell integrations must use HTTPS.";
          if (!t) {
              window.console && console.warn("You may test your goSell integration over HTTP. However, live goSell integrations must use HTTPS.")
          } else {
              window.console && console.warn(o)
          }

      };

      if ("" === key) throw new Error("Please call goSell() with your publishable key. You used an empty string.");
      if (0 === key.indexOf("sk_")) throw new Error("You should not use your secret key with goSell.\n        Please pass a publishable key instead.");
      _ensureHTTPS(key);

      try {

        self._apiKey = key;
        self._encryption_key = 'sdfds';

      } catch(e) {
          //throw new Error("Please use valid tap js config json file");
      }

      var elements_data;
      self.getInfo = function () {
          return this;
      };
      self.statusFocus = function(card,result){


      }
      self.createToken = function(card,result){

          if(self.lock==true){
              //console.log('wait')
              return;
          }

          self.lock = true;

          return new Promise(function(resolve, reject) {

              var iframeWin = document.getElementById("myFrame").contentWindow;
              iframeWin.postMessage({'action':'submit','key':self._apiKey,'encryption_key':self._encryption_key}, window.location.protocol+"//"+frameurl+"/tap_payment_widget_ui");

              window.addEventListener('message', receivertoken, false);

              function receivertoken(e) {
                  if(this.card){
                    var iframe_obj = this.card._iframe;
                  }
                  else{
                    var iframe_obj = document.getElementById('myFrame');
                  }

                  if(iframe_obj != null){
                    var i_obj = iframe_obj.getAttribute('src');

                    if (0 === i_obj.indexOf(e.origin)){
                        ////console.log(e.data);
                        if(e.data.error){
                            self.lock = false;
                            resolve(e.data)
                        }

                        if(e.data.type=='token' && e.data.data){
                            self.lock = false;
                            resolve(e.data.data.result);
                        }
                        if(e.data.type=='token'){
                          self.lock = false;
                          resolve(e.data);
                        }
                   }
                  }

              }


          });
      }
      self.elements= function(options){
          this.elements.card={};
          this.elements.card.getCurrency= function(){
              return self.currencyCode;
          }
          self.elements.card.currency= function(crncy){
              return new Promise(function(resolve, reject) {
                      if(document.getElementById("myFrame")!=null){
                          self.currencyCode=crncy;
                          var iframeWin = document.getElementById("myFrame").contentWindow;
                          iframeWin.postMessage({'action':'currency','key':self._apiKey,'currency':crncy}, window.location.protocol+"//"+frameurl+"/tap_payment_widget_ui");
                      }

              });
          }

          self.elements.card.clearForm= function(){
              return new Promise(function(resolve, reject) {
                      if(document.getElementById("myFrame")!=null){
                          var iframeWin = document.getElementById("myFrame").contentWindow;
                          iframeWin.postMessage({'action':'clearForm','key':self._apiKey}, window.location.protocol+"//"+frameurl+"/tap_payment_widget_ui");
                      }

              });
          }
          self.elements.card.mount= function(id){
              var s = document.querySelector(id);
              if(s){
              //s.parentNode.style.maxWidth="400px";
                  var d = document.createElement("div");
                  d.setAttribute("id",'privateTapElement');
                  d.setAttribute("style",'height:inherit;margin: 0px !important; padding: 0px !important; border: medium none !important; display: block !important; background: transparent none repeat scroll 0% 0% !important; position: relative !important; opacity: 1 !important; width:100%;');

                  s.appendChild(d);
                  d.appendChild(this._iframe);
              }
              //bewlo code is not working due to CORs restriction, should enable it then un comment
              /*this._iframe.onload = function(){
                  detect_details().then(function(details) {
                      var iframeWin = document.getElementById("myFrame").contentWindow;
                      iframeWin.postMessage({'action':'userdetails','key':this._apiKey,'details':details}, window.location.protocol+"//"+frameurl+"/tap_payment_widget");
                  });
              };*/

          }
          self.elements.card.addEventListener= function(id, res){

            // console.log('card id', id);
              window.addEventListener('message', receiver, false);
              ////console.log(this)
              if(this.card){
                var iframe_obj = this.card._iframe;
              }
              else{
                var iframe_obj = document.getElementById('myFrame');
              }

              function receiver(e) {
                  //if (0 === self.card._iframe.src.indexOf(e.origin)){
                  if (iframe_obj && 0 === iframe_obj.src.indexOf(e.origin)){
                      /*console.log("received in js library");
                      console.log(e.data);*/
                      if(e.data.layout){
                          var iframeWin = document.getElementById("myFrame");
                          //iframeWin.setAttribute("height","140px");
                          iframeWin.setAttribute("height",e.data.layout.height)
                          res({loaded:true});
                          self.detect_details().then(function(details) {
                              var iframeWin = document.getElementById("myFrame").contentWindow;
                              iframeWin.postMessage({'action':'client_ip','key':self._apiKey,'client_ip':details.ip}, window.location.protocol+"//"+frameurl+"/tap_payment_widget");
                          });
                          ////console.log(e.data.layout.height);
                          //iframeWin.setAttribute("height",e.data.layout.height)
                      }
                      if(e.data.success==true && e.data.BIN && e.data.type!='token'){
                          self.tds=e.data;
                          res(e.data)

                      } else {
                          res(e.data)
                       }
                 }
              }
          }

          self.elements.create = function(type,options_object, paymentOptions){

              this.card.type= type;

              //console.log('type', type);
              //console.log('self.card', this.card);
              var x = document.createElement("IFRAME");
              x.setAttribute("id",'myFrame');
              x.setAttribute("name",'myFrame');
              x.setAttribute("title",'Secure payment input');
              x.setAttribute("allowpaymentrequest",'true');
              //below line disables javascript in iframe
              //x.setAttribute("security",'restricted');
              ////console.log(objectToQueryString(options_object));

              x.setAttribute("style",'border: none !important;margin: 0px !important;padding: 0px !important;min-width: 100% !important;overflow: hidden !important;display: block !important;');

              x.setAttribute("src", window.location.protocol+"//"+frameurl+"/tap_payment_widget_ui?"+ self.objectToQueryString(options_object)+'&key='+key+'&'+ self.objectToQueryString(paymentOptions));
              this.card._iframe =  x;
              self.currencyCode = paymentOptions.currencyCode;
              // console.log('it is card', this.card);

              return this.card;
          }
          this.elements.options = options;
          return this.elements;

      }

      return this;
  }

  generateCardForm(){
    var self = this;

    this.tap = this.generateForm(this.RootStore.configStore.gateway.publicKey);

    var elements = this.tap.elements({});

    var style = this.RootStore.configStore.style;

    var paymentOptions = {};

    //console.log('current currency', this.RootStore.paymentStore.current_currency);

    if(self.RootStore.configStore.view === 'GOSELL_ELEMENTS'){
      paymentOptions = {
       currencyCode: this.RootStore.paymentStore.currencies,
       labels : this.RootStore.configStore.labels,
       paymentAllowed: this.RootStore.configStore.gateway.supportedPaymentMethods,
       TextDirection: this.RootStore.uIStore.getDir
     }
     //console.log('&& gosell elements', this.RootStore.paymentStore.currencies);
    }
    else {
      if(this.RootStore.configStore.transaction_mode === 'get_token' || this.RootStore.configStore.transaction_mode === 'save_card'){
          paymentOptions = {
           currencyCode: this.RootStore.paymentStore.currencies,
           labels : this.RootStore.configStore.labels,
           paymentAllowed: this.RootStore.configStore.gateway.supportedPaymentMethods,
           TextDirection: this.RootStore.uIStore.getDir
         }

         //console.log('&& save card', this.RootStore.paymentStore.currencies);
      }
      else {
         paymentOptions = {
          currencyCode: [this.RootStore.paymentStore.current_currency.currency],
          labels : this.RootStore.configStore.labels,
          paymentAllowed: this.RootStore.configStore.gateway.supportedPaymentMethods,
          TextDirection: this.RootStore.uIStore.getDir
        }

        //console.log('&& else', [this.RootStore.paymentStore.current_currency.currency]);
      }
    }

    this.card = elements.create('card', {style: style}, paymentOptions);
    this.card.mount('#element-container');

    this.card.addEventListener('change', function(event) {
      console.log('change event', event);
      self.onChange(event);
    });

  }

  onChange(event){
    var self = this;
    var bin = true;
    var active_brand = null;

    if(event.code == 200){
      self.RootStore.paymentStore.save_card_active = true;
      self.RootStore.uIStore.setIsActive('FORM');
      console.log('form', self.RootStore.uIStore.getIsActive);
      var total = self.RootStore.paymentStore.active_payment_option_total_amount > 0 ? self.RootStore.paymentStore.current_currency.symbol + self.RootStore.uIStore.formatNumber(self.RootStore.paymentStore.active_payment_option_total_amount.toFixed(self.RootStore.paymentStore.current_currency.decimal_digit)) : '';

      self.RootStore.uIStore.goSellBtn({
        title: self.RootStore.configStore.btn + ' ' + total,
        color: '#2ACE00',
        active: true
      });

      // console.log('onChange', self.RootStore.uIStore.btn);

      //console.log('I am in success');

      if(self.RootStore.configStore.transaction_mode === 'save_card'){
        self.RootStore.paymentStore.saveCardOption(true);
      }
    }
    else if(event.code == 100 && event.focus == 'in'){
      self.cardFormHandleClick();
      // set the flag true every time the frame is focused
      this.submitBtnFlag  = true
    }
    else if(event.code == 403 && event.status == 'invalid'){
      self.RootStore.uIStore.goSellBtn({
        title: self.RootStore.configStore.btn,
        active: false,
        loader: false
      });
    }
    else if(event.code == 400 || (event.error_interactive && event.error_interactive.code == 400)){

        if(self.RootStore.uIStore.btn.active && self.RootStore.uIStore.btn.loader){
          self.RootStore.uIStore.warningHandler();
        }
        else {
          self.RootStore.paymentStore.save_card_active = false;
          self.RootStore.paymentStore.saveCardOption(false);
          // self.RootStore.uIStore.payBtn(false);

          console.log('event code 400');

          //console.log('I am in error');
          if(event.error_interactive){
            self.RootStore.uIStore.setErrorHandler({
              visable: true,
              code: event.error_interactive.code,
              msg: event.error_interactive.message,
              type: 'error'
            });
          }

          if(event.error && event.error.code && (event.error.code === 409 || event.error.code === 403)){
            //hide form here
            self.hide = true;

            if(event.error.code === 403){
              self.RootStore.uIStore.setErrorHandler({
                visable: true,
                code: event.error.code,
                msg: event.error.message,
                type: 'error'
              });
            }
          }
          else {
            self.hide = false;
          }
        }

    }
    else if(event.code == 101 && event.code == 200){
      console.log("it's out & successful");
    }
    else if(event.code == 101 && event.code != 200){
      console.log("it's out");
    }


    if(event.BIN && event.BIN.card_brand !== active_brand){
        //console.log(event.BIN.card_brand);

        if(self.RootStore.configStore.view !== 'GOSELL_ELEMENTS'){
          self.RootStore.paymentStore.getFees(event.BIN.card_brand);

        }

        //console.log(active_brand, event.BIN);
        active_brand = event.BIN.card_brand;
    }

    if(event.loaded){
      //console.log('loaded!!!!! ', event.loaded);

      if(self.RootStore.configStore.transaction_mode === 'get_token' || self.RootStore.configStore.transaction_mode === 'save_card'){
        //console.log('&& update the element height');
        self.RootStore.uIStore.calcElementsHeight('form-container');
      }
      else {
        self.RootStore.uIStore.calcElementsHeight('gosell-gateway-payment-options');
      }

    }
  }

  // checkFocus() {
  //
  //   var self = this;
  //   var statusFocus = null;
  //
  //   var isfocused = document.getElementById("myFrame");
  //
  //       if(document.activeElement == isfocused) {
  //         if(statusFocus != false){
  //             statusFocus=false;
  //             // console.log('in focus');
  //             // if(self.RootStore.configStore.view !== 'GOSELL_ELEMENTS'){
  //               self.cardFormHandleClick();
  //             // }
  //             //return {"statusFocus":statusFocus,'message':"iframe has focus"};
  //         }
  //       } else {
  //         if(statusFocus != true){
  //           // console.log('in focus');
  //             statusFocus=true;
  //             //return {"statusFocus":statusFocus,'message':"iframe has not focused"};
  //         }
  //       }
  //
  //       return;
  //  }

   cardFormHandleClick(){

     if(this.RootStore.uIStore.btn.active && this.RootStore.uIStore.btn.loader){
       this.RootStore.uIStore.warningHandler();
     }
     else {
       this.RootStore.paymentStore.selected_card = null;
       this.RootStore.uIStore.setSubPage(-1);

       //clear open menus
       // this.RootStore.uIStore.setPageIndex(0);
       // this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(0) : this.RootStore.uIStore.setSubPage(-1);

       if(this.RootStore.uIStore.getIsActive !== 'FORM'){
         this.RootStore.paymentStore.active_payment_option_total_amount = 0;
         this.RootStore.uIStore.setErrorHandler({});
         this.RootStore.uIStore.delete_card = null;
         // this.RootStore.uIStore.payBtn(false);

         this.RootStore.uIStore.goSellBtn({
           title: this.RootStore.configStore.btn,
           active: false,
           loader: false
         });

       }

       //form is active
       this.RootStore.uIStore.setIsActive('FORM');


    }

   }

   async generateToken() {
     var self = this;

     await this.tap.createToken(this.card).then(function(result) {

         if (result.error) {
            self.RootStore.paymentStore.save_card_active = false;
            self.RootStore.paymentStore.saveCardOption(false);

            // Inform the user if there was an error
            self.RootStore.uIStore.setErrorHandler({
                 visable: true,
                 code: 0,
                 msg: result.error.message,
                 type: 'error'
            });

         } else {
             self.RootStore.uIStore.setIsActive('FORM');
             //console.log('result ----> ', result);
             self.RootStore.paymentStore.source_id = result.id;
             self.RootStore.paymentStore.active_payment_option = result.card;
             //console.log('card details', result.card);
             self.RootStore.uIStore.stopBtnLoader();

             // Send the token to your server
             if(self.RootStore.configStore.transaction_mode === 'get_token'){

                 self.RootStore.configStore.callbackFunc(result);

                 self.RootStore.uIStore.setErrorHandler({
                   visable: true,
                   code: 200,
                   msg: result.id,
                   type: 'success'
                 });

                 self.clearCardForm();
              }
         }
     });
    }

   clearCardForm(){
     if(this.card != null){
       this.card.clearForm();
       // this.RootStore.uIStore.payBtn(false);
       this.RootStore.uIStore.goSellBtn({
         title: this.RootStore.configStore.btn,
         active: false,
         loader: false
       });
     }

   }

   switchCurrency(value){
     //console.log('switch currencies', value);
     var currency = value.currency;
     var v = [currency];
     //console.log('switcher', v);
     this.card.currency(v);
   }

}

decorate(FormStore, {
  lock:observable,
  currencyCode:observable,
  tap:observable,
  card:observable,
});

export default FormStore;
