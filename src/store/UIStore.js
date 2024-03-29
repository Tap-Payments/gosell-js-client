import React from "react";
import { computed, action, makeObservable, observable } from "mobx";
import NotificationBar from "../elements/NotificationBar";

class UIStore {
  constructor(RootStore) {
    this.RootStore = RootStore;

    this.reset();

    makeObservable(this, {
      openModal: observable,
      modalMode: observable,
      modalID: observable,
      tap_id: observable,
      errorHandler: observable,
      isLoading: observable,
      setOpenModal: action,
      setMode: action,
      setLoader: action,
      generateCustomNotification: computed,
      getErrorHandler: computed,
    });
  }

  reset() {
    this.tap_id = null;
    this.openModal = false;
    this.modalID = "gosell-lightbox-payment-gateway";
    this.modalMode = "popup";
    this.errorHandler = {};

    this.isLoading = true;
  }

  setOpenModal(value) {
    this.openModal = value;
  }

  setMode(value) {
    this.modalMode = value;
  }

  setLoader(value) {
    this.isLoading = value;
  }

  // computed;
  get generateCustomNotification() {
    var self = this;
    //console.log('notifications type', this.RootStore.configStore.notifications);
    //console.log('msg', this.getErrorHandler);

    if (
      this.RootStore.configStore.notifications !== "standard" &&
      !this.getErrorHandler.options
    ) {
      ////console.log('id', this.RootStore.configStore.notifications);

      var el = document.getElementById(
        this.RootStore.configStore.notifications,
      );
      ////console.log('element', el);

      if (this.getErrorHandler.msg && el != null) {
        ////console.log('this is happening');
        el.innerHTML = this.getErrorHandler.msg;
      }
      setTimeout(function() {
        self.closeNotification();
      }, 5000);
    } else if (
      this.RootStore.configStore.notifications === "standard" ||
      this.getErrorHandler.options
    ) {
      return (
        <NotificationBar
          mode={this.getErrorHandler.type}
          dir={this.dir}
          close={this.closeNotification}
          show={this.getErrorHandler.visable}
          options={this.getErrorHandler.options}
        >
          {this.getErrorHandler.msg}
        </NotificationBar>
      );
    }
  }

  closeNotification() {
    // var self = this;

    if (this.RootStore.configStore.notifications !== "standard") {
      var el = document.getElementById(
        this.RootStore.configStore.notifications,
      );
      el.innerHTML = "";
    } else {
      this.errorHandler.visable = false;
      this.errorHandler = {};
    }
  }

  // computed;
  get getErrorHandler() {
    return this.errorHandler;
  }

  setErrorHandler(value) {
    var self = this;
    this.errorHandler = value;

    if (
      this.RootStore.configStore.notifications === "standard" &&
      value.visable
    ) {
      window.scroll(0, 0);
    }

    setTimeout(function() {
      self.closeNotification();
    }, 5000);
  }
}

export default UIStore;
