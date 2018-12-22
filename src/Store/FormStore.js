import {decorate, observable, computed} from 'mobx';
import 'bluebird';

class FormStore{

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.currencyCode = null;
    this.lock = false;
    this._apiKey = null;
    this._encryption_key = 'sdfds';
    this.tds='';
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
      function _ensureHTTPS(){
          var e = window.location.protocol,
          t = -1 !== ["https:", "file:"].indexOf(e),
          n = -1 !== ["localhost", "127.0.0.1", "0.0.0.0"].indexOf(window.location.hostname),
          o = "Live Tapjsli.js integrations must use HTTPS. For more information: ";
          if (!t) {
              window.console && console.warn("You may test your Tapjsli.js integration over HTTP. However, live Tapjsli.js integrations must use HTTPS.")
          } else {
              window.console && console.warn(o)
          }

      };
      if ("" === key) throw new Error("Please call Tapjsli() with your publishable key. You used an empty string.");
      if (0 === key.indexOf("sk_")) throw new Error("You should not use your secret key.\n Please pass a publishable key instead.");
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
              console.log('wait')
              return;
          }

          self.lock = true;

          return new Promise(function(resolve, reject) {

              var iframeWin = document.getElementById("myFrame").contentWindow;
              iframeWin.postMessage({'action':'submit','key':self._apiKey,'encryption_key':self._encryption_key}, "https://"+frameurl+"/tap_payment_widget_ui");

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
                        //console.log(e.data);
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
                          iframeWin.postMessage({'action':'currency','key':self._apiKey,'currency':crncy}, "https://"+frameurl+"/tap_payment_widget_ui");
                      }

              });
          }

          self.elements.card.clearForm= function(){
              return new Promise(function(resolve, reject) {
                      if(document.getElementById("myFrame")!=null){
                          var iframeWin = document.getElementById("myFrame").contentWindow;
                          iframeWin.postMessage({'action':'clearForm','key':self._apiKey}, "https://"+frameurl+"/tap_payment_widget_ui");
                      }

              });
          }
          self.elements.card.mount= function(id){
              var s = document.querySelector(id);
              s.parentNode.style.maxWidth="400px";
              var d = document.createElement("div");
              d.setAttribute("id",'privateTapElement');
              d.setAttribute("style",'height:inherit;margin: 0px !important; padding: 0px !important; border: medium none !important; display: block !important; background: transparent none repeat scroll 0% 0% !important; position: relative !important; opacity: 1 !important; width:100%;');

              s.appendChild(d);
              d.appendChild(this._iframe);
              //bewlo code is not working due to CORs restriction, should enable it then un comment
              /*this._iframe.onload = function(){
                  detect_details().then(function(details) {
                      var iframeWin = document.getElementById("myFrame").contentWindow;
                      iframeWin.postMessage({'action':'userdetails','key':this._apiKey,'details':details}, "https://"+frameurl+"/tap_payment_widget");
                  });
              };*/

          }
          self.elements.card.addEventListener= function(id, res){


              window.addEventListener('message', receiver, false);
              //console.log(this)
              if(this.card){
                var iframe_obj = this.card._iframe;
              }
              else{
                var iframe_obj = document.getElementById('myFrame');
              }

              function receiver(e) {
                  //if (0 === self.card._iframe.src.indexOf(e.origin)){
                  if (0 === iframe_obj.src.indexOf(e.origin)){
                      /*console.log("received in js library");
                      console.log(e.data);*/
                      if(e.data.layout){
                          var iframeWin = document.getElementById("myFrame");
                          //iframeWin.setAttribute("height","140px");
                          iframeWin.setAttribute("height",e.data.layout.height)
                          res({loaded:true});
                          self.detect_details().then(function(details) {
                              var iframeWin = document.getElementById("myFrame").contentWindow;
                              iframeWin.postMessage({'action':'client_ip','key':self._apiKey,'client_ip':details.ip}, "https://"+frameurl+"/tap_payment_widget");
                          });
                          //console.log(e.data.layout.height);
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

              console.log('type', type);
              console.log('self.card', this.card);
              var x = document.createElement("IFRAME");
              x.setAttribute("id",'myFrame');
              x.setAttribute("name",'myFrame');
              x.setAttribute("title",'Secure payment input');
              x.setAttribute("allowpaymentrequest",'true');
              //below line disables javascript in iframe
              //x.setAttribute("security",'restricted');
              //console.log(objectToQueryString(options_object));

              x.setAttribute("style",'border: none !important;margin: 0px !important;padding: 0px !important;min-width: 100% !important;overflow: hidden !important;display: block !important;');

              x.setAttribute("src", /*window.location.protocol+*/"https://"+frameurl+"/tap_payment_widget_ui?"+ self.objectToQueryString(options_object)+'&key='+key+'&'+ self.objectToQueryString(paymentOptions));
              this.card._iframe =  x;
              self.currencyCode = paymentOptions.currencyCode
              console.log('it is card', this.card);
              return this.card;
          }
          this.elements.options = options;
          return this.elements;

      }

      return this;
  }

}

decorate(FormStore, {
  lock:observable,
  currencyCode:observable
});

export default FormStore;
