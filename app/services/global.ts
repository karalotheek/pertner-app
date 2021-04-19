import { Injectable } from '@angular/core';
import { WebstorageService } from 'src/app/services/webstorage.service';
import { CategoryService } from 'src/app/services/category.service';
import { ServicesService } from 'src/app/services/services.service';
import { UserService } from 'src/app/services/users.service';
import { OtherService } from 'src/app/services/other.service';
import { Router } from "@angular/router"
import { environment } from '../../environments/environment';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject } from 'rxjs';
import { includes } from 'lodash';
declare var $: any
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // BehaviorSubject is used because when if category compo already rendered then after changes active category from footer compo,
  // then we need to update activeCategory variable inside category compo so that updated data rerender

  // In the GlobalService, we create a private BehaviorSubject that will hold the current value of the activeCategory.
  // We define a activeCategoryChanges variable handle this data stream as an observable that will be used by the components.Lastly,
  // we create function changeActiveCategory that calls next on the BehaviorSubject to change its value .

  // The category components receive the same value of activeCategory.We inject the GlobalService in the constructor of category compo,
  // then subscribe to the activeCategoryChanges observable and set its value equal to the activeCategory variable inside category compo.

  private activeCatSource = new BehaviorSubject('');
  activeCategoryChanges = this.activeCatSource.asObservable();
  loggedInUserData: any = '';
  bookingItems: any;
  activeRout: string;
  activeCategoriesList: any;
  activeServicesList: any;
  environment: string;
  notificationList: any = [];
  resolvedRoutesList: any = [];
  categoryUrl: any;
  constructor(private webstorageService: WebstorageService, private categoryService: CategoryService, private servicesService: ServicesService, private router: Router, private userService: UserService, private otherService: OtherService, private platform: Platform) {
    this.environment = environment.development ? 'development' : 'production';
    if (webstorageService.getValueFromLocalStorage('loggedInUserData')) {
      this.loggedInUserData = webstorageService.getValueFromLocalStorage('loggedInUserData');
      this.getUserData(this.loggedInUserData.phone);
    }
    if (webstorageService.getValueFromLocalStorage('bookingItems')) this.bookingItems = webstorageService.getValueFromLocalStorage('bookingItems');
    this.getAllCategories();
    this.getAllServices();
    if (!this.activeRout) {
      let activeRout = window.location.pathname.split('/')[1];
      if (!activeRout) activeRout = 'home';
      this.activeRout = activeRout;
    }
    // for default category when page refresh or initial page load then set active category data in BehaviorSubject
    // so that it can accessible inside category component
    // let activeCategory = webstorageService.getValueFromLocalStorage('activeCategory');
    // if (!activeCategory) this.setActiveNav('')
    // else this.changeActiveCategory(activeCategory);
    router.events.subscribe(val => {
      $(".modal-fade").modal("hide");
      $(".modal-backdrop").remove();
      $("body").removeClass('modal-open');
      $("#enquiryModal").modal('hide');
      $("#enquiryConfirmationModal").modal('hide');
      $("#getOtpModal").modal('hide');
    });
  }
  getUserData(phone) {
    this.userService.getUserByPhone(phone).subscribe((user) => {
      this.setLoggedInUserData(user[0]);
    })
  }
  getAllCategories() {
    this.categoryService.getActiveCategories().subscribe((category) => {
      this.activeCategoriesList = category;
    })
  }
  getAllServices() {
    this.servicesService.getActiveServices().subscribe((allServices) => {
      this.activeServicesList = allServices;
    })
  }
  getNotifications() {
    if (this.loggedInUserData) {
      this.otherService.getActiveNotifications(this.loggedInUserData.key).subscribe((data) => {
        if (data.length != 0) {
          this.notificationList = data;
        } else this.notificationList = [];
      })
    }
  }
  setLoggedInUserData(data) {
    this.loggedInUserData = data;
    this.webstorageService.setValueInLocalStorage("loggedInUserData", this.loggedInUserData);
    this.getNotifications();
  }
  removeLoggedInUserData() {
    this.notificationList = [];
    this.loggedInUserData = null;
    this.webstorageService.removeItemFromLocalStorage("loggedInUserData");
  }
  addOrderItemToCart(data) {
    let bookingItems = this.bookingItems ? this.bookingItems : [];
    bookingItems.push(data);
    this.webstorageService.setValueInLocalStorage("bookingItems", bookingItems);
    this.bookingItems = this.webstorageService.getValueFromLocalStorage('bookingItems');
  }
  removeOrderItemToCart(key) {
    let bookingItems = this.bookingItems.filter((data) => data.key != key);
    this.webstorageService.setValueInLocalStorage("bookingItems", bookingItems);
    this.bookingItems = this.webstorageService.getValueFromLocalStorage('bookingItems');
  }
  replaceBookingItems(bookingItems) {
    this.webstorageService.setValueInLocalStorage("bookingItems", bookingItems);
    this.bookingItems = this.webstorageService.getValueFromLocalStorage('bookingItems');
  }
  clearCart() {
    this.webstorageService.removeItemFromLocalStorage("bookingItems");
    this.bookingItems = this.webstorageService.getValueFromLocalStorage('bookingItems');
  }
  changeActiveCategory(category) {
    this.getCategoryUrl(category).then((url) => {
      this.setActiveNav(url);
    }).catch((error) => {
      console.log(error);
      this.setActiveNav('home');
    })
    this.activeCatSource.next(category)
  }
  vibrate() {
    // console.log(this.platform)
    if (!this.platform.IOS && !this.platform.SAFARI) {
      if (window.navigator) {
        window.navigator.vibrate(200)
      }
    }
  }
  numberOnly(event): boolean {
    var RegExp = /^\d*\.?\d*$/;
    if (RegExp.test(event.key)) {
      return true;
    } else {
      return false
    }
  }
  // navigation functions
  getCategoryUrl(category) {
    return new Promise((res, rej) => {
      if (category && category.sUrl) {
        let url = category.sUrl.toLowerCase();
        url = url.split(" ").join("-");
        url = url.split("  ").join("-");
        url += '-services'
        res(url);
      } else {
        this.setActiveNav('home');
        rej('category url not found');
      }
    })
  }
  getServiceUrl(service) {
    return new Promise((res, rej) => {
      if (service && service.sUrl && this.categoryUrl) {
        let url = service.sUrl.toLowerCase();
        url = url.split(" ").join("-");
        url = url.split("  ").join("-");
        url = this.categoryUrl + '/' + url;
        res(url);
      } else {
        this.setActiveNav('home');
        rej('service url not found');
      }
    })
  }
  toggleClass(e, status): any {
    // if (window.location.pathname.includes('myaccount/1')) this.activeRout = 'currentbookingstatus';
    let stringClass = 'nav-active';
    var headerInterval = setInterval(() => {
      if (document.querySelector('header') && document.querySelector('.nav')) {
        clearInterval(headerInterval);
        let element = document.querySelector('header')
        if (element.classList.contains(stringClass) || status) element.classList.remove(stringClass); else element.classList.add(stringClass);
        element = document.querySelector('.nav')
        if (element.classList.contains(stringClass) || status) element.classList.remove(stringClass); else element.classList.add(stringClass);
      }
    })
  };
  setActiveNav(nav): any {
    this.activeRout = nav;
    this.toggleClass(null, true);
    if (nav == 'currentbookingstatus') {
      this.router.navigate(['/myaccount/1']);
    } else if (nav == 'logout') {
      this.removeLoggedInUserData();
      this.loggedInUserData = null;
    } else {
      this.router.navigate([`/${nav}`]);
    }
    // switch (nav) {
    // case nav.includes('-services'):
    //   let activeCategory = this.webstorageService.getValueFromLocalStorage('activeCategory');
    //   //  changeActiveCategory this function changes the activeCategory value inside BehaviorSubject by calling next which is observable so that 
    //   // when data changes inside this obj then category compo subscribe to it and update own component regarding new category value
    //   this.changeActiveCategory(activeCategory);
    //   break;
    // }
    if (nav == 'currentbookingstatus') this.activeRout = 'currentbookingstatus';
  };
}
