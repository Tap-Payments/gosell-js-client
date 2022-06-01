import { makeObservable, observable } from "mobx"

class LocalizationStore {
  constructor(RootStore) {
    this.RootStore = RootStore
    this.isLoading = true
    this.strings = require("./localization.json")

    makeObservable(this, {
      isLoading: observable,
      strings: observable
    })
  }

  getContent(key, lang) {
    if (this.strings !== null) {
      const _defaultLang = this.RootStore.configStore.language ? this.RootStore.configStore.language.toLowerCase() : "en"
      const _lang = lang ? lang.toLowerCase() : _defaultLang
      if (key) {
        const txt = this.strings[key][_lang]
        if (txt) {
          // //console.log('txt',txt);
          return txt
        } else {
          return " "
        }
      } else {
        return " "
      }
    } else {
      return " "
    }
  }
}

export default LocalizationStore
