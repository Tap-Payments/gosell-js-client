import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
import Paths from '../../webpack/paths';

class ApiStore{

  constructor(RootStore) {
    this.RootStore = RootStore;
  }

  async getLocalization(){
    var self = this;
    var res = null;
    await axios.post(Paths.serverPath +'/localization', {})
    .then(async function (response) {
      //console.log('localization', response);
      res = response.data;
    })
    .catch(function (error) {
      //console.log("error", error);
    });

    return await res;
  }

  async generateToken(body){
    var self = this;

    var res = null, data = null;
    await axios.post(Paths.serverPath + '/generate', body)
    .then(async function (response) {

      res = response.data;

      //console.log('generate response', res);
    })
    .catch(function (error) {
      //console.log(error);
    });

    return await res;
  }

  async getIP(){
    var self = this;

    var header = {
      'Content-Type':'application/json'
    }

    var res = null;
    await axios.get('https://api.ipify.org?format=jsonp&callback=', header)
    .then(async function(response) {
      //console.log('ip', response);
      if(response.status == 200){
        res = eval(response.data).ip;
        console.log('res ip', res);
      }
    })
    .catch(function (error) {
      console.log("error", error);
    });

    return await res;
  }
}

decorate(ApiStore, {});

export default ApiStore;
