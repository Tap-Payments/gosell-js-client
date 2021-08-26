import { decorate } from "mobx";
import axios from "axios";
import Paths from "../../webpack/paths";

class ApiStore {
  constructor(RootStore) {
    this.RootStore = RootStore;
  }

  async getLocalization() {
    var res = null;
    await axios
      .post(Paths.serverPath + "/localization", {})
      .then(async function(response) {
        res = response.data;
      })
      .catch(function(error) {
        console.error(error);
      });

    return await res;
  }

  async generateToken(body) {
    var self = this;

    var res = null;

    await axios
      .post(Paths.serverPath + "/generate", body)
      .then(async function(response) {
        res = response.data;

        self.RootStore.configStore.gateway.onLoad
          ? self.RootStore.configStore.gateway.onLoad()
          : null;
      })
      .catch(function(error) {
        console.error(error);
      });

    return await res;
  }

  async getIP() {
    var self = this;

    var header = {
      "Content-Type": "application/json",
    };

    var res = null;
    await axios
      .get("https://api.ipify.org?format=jsonp&callback=", header)
      .then(async function(response) {
        if (response.status == 200) {
          res = eval(response.data).ip;
        }
      })
      .catch(function(error) {
        console.error(error);
      });

    return await res;
  }
}

decorate(ApiStore, {});

export default ApiStore;
