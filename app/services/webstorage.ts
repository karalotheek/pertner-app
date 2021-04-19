import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebstorageService {

  constructor() { }

  setValueInLocalStorage(key, value) {
    type Dict = { [key: string]: string };
    var storage: Dict = {};
    let localstorageData = window.localStorage.getItem('theekkaralo');
    if (storage && localstorageData != '' && localstorageData != 'undefined' && (JSON.parse(localstorageData)) != null) {
      storage = (JSON.parse(window.localStorage.getItem('theekkaralo')));
      storage[key] = value;
      window.localStorage.setItem('theekkaralo', JSON.stringify(storage))
    } else {
      let object = {};
      object[key] = value;
      window.localStorage.setItem('theekkaralo', JSON.stringify(object));
    }
  }

  getValueFromLocalStorage(key) {
    let value = null;
    let storage = window.localStorage.getItem('theekkaralo');
    if (storage && storage != '' && storage != 'undefined' && (JSON.parse(storage)) != null) {
      storage = (JSON.parse(storage));
    }
    return (storage && storage[key]) ? storage[key] : null;
  }

  removeItemFromLocalStorage(key) {
    type Dict = { [key: string]: string };
    var storage: Dict = {};
    let localstorageData = window.localStorage.getItem('theekkaralo');
    if (storage && localstorageData != '' && localstorageData != 'undefined' && (JSON.parse(localstorageData)) != null) {
      storage = (JSON.parse(window.localStorage.getItem('theekkaralo')));
      if (storage[key]) {
        delete storage[key];
        window.localStorage.setItem('theekkaralo', JSON.stringify(storage))
      }
    }
  }

  setValueInSessionStorage(key, value) {
    type Dict = { [key: string]: string };
    var storage: Dict = {};
    let sessionStorageData = window.localStorage.getItem('theekkaralo');
    if (storage && sessionStorageData != '' && sessionStorageData != 'undefined' && (JSON.parse(sessionStorageData)) != null) {
      storage = (JSON.parse(window.localStorage.getItem('theekkaralo')));
      storage[key] = value;
      window.sessionStorage.setItem('theekkaralo', JSON.stringify(storage))
    } else {
      let object = {};
      object[key] = value;
      window.sessionStorage.setItem('theekkaralo', JSON.stringify(object));
    }
  }

  getValueFromSessionStorage(key) {
    let value = null;
    type Dict = { [key: string]: string };
    var storage: Dict = {};
    let sessionStorageData = window.sessionStorage.getItem('theekkaralo');
    if (storage && sessionStorageData != '' && sessionStorageData != 'undefined' && (JSON.parse(sessionStorageData)) != null) {
      storage = (JSON.parse(window.sessionStorage.getItem('theekkaralo')));
    }
    return (storage && storage[key]) ? storage[key] : null;
  }

  removeItemFromSessionStorage(key) {
    type Dict = { [key: string]: string };
    var storage: Dict = {};
    let sessionStorageData = window.sessionStorage.getItem('theekkaralo');
    if (storage && sessionStorageData != '' && sessionStorageData != 'undefined' && (JSON.parse(sessionStorageData)) != null) {
      storage = (JSON.parse(window.sessionStorage.getItem('theekkaralo')));
      if (storage[key]) {
        delete storage[key];
        window.sessionStorage.setItem('theekkaralo', JSON.stringify(storage))
      }
    }
  }

  setValueInCookies(key, value, expDays) {
    document.cookie = key + "=" + value + ';expires=' + expDays.toGMTString() + ';path=/';
  }

  getValueFromCookies(key) {
    let value = null;
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    ca && ca.map((dataString) => {
      //remove spaces from string at starting
      while (dataString.charAt(0) == ' ') {
        dataString = dataString.substring(1);
      }
      if (dataString.indexOf(name) == 0) {
        value = dataString.substring(name.length, dataString.length);
      }
    })
    return value;
  }

  removeValueFromCookies(key) {
    document.cookie = key + '=;expires=' + new Date().toUTCString() + ';path=/';
  }
}
