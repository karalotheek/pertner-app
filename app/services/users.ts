import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  userRef = firebase.firestore().collection('user');
  vendorRef = firebase.firestore().collection('vendors');

  // getUserByPhone(phone): Observable<any> {
  //   return new Observable((observer) => {
  //     this.userRef.onSnapshot((querySnapshot) => {
  //       let user = [];
  //       querySnapshot.forEach((doc) => {
  //         let data = doc.data();
  //         if (data.phone == phone) {
  //           data.key = doc.id,
  //             user.push(data);
  //         }
  //       });
  //       observer.next(user);
  //     });
  //   });
  // }
  getUserByPhone(phone): Observable<any> {
    return new Observable((observer) => {
      this.userRef.where('phone', '==', phone).get().then((querySnapshot) => {
        let user = []
        querySnapshot.forEach(function (doc) {
          let data = doc.data();
          data.key = doc.id;
          user.push(data);
        })
        observer.next(user);
      })
    })
  }
  updateUser(id: string, data): Observable<any> {
    data.createdOn = data.createdOn || new Date();
    data.modifiedOn = new Date();
    return new Observable((observer) => {
      this.userRef.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }
  registerUser(data): Observable<any> {
    data.createdOn = new Date();
    data.modifiedOn = new Date();
    return new Observable((observer) => {
      this.userRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }
  registerVendor(data): Observable<any> {
    data.createdOn = new Date();
    data.modifiedOn = new Date();
    return new Observable((observer) => {
      this.vendorRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }
  getVendorByPhone(phone): Observable<any> {
    return new Observable((observer) => {
      this.vendorRef.where('phone', '==', phone).get().then((querySnapshot) => {
        let vendor = []
        querySnapshot.forEach(function (doc) {
          let data = doc.data();
          data.key = doc.id;
          vendor.push(data);
        })
        observer.next(vendor);
      })
    })
  }
  getVendors(): Observable<any> {
    return new Observable((observer) => {
      this.vendorRef.onSnapshot((querySnapshot) => {
        let vendor = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.key = doc.id;
          vendor.push(data);
        });
        observer.next(vendor);
      });
    });
  }
  getUser(id: string): Observable<any> {
    return new Observable((observer) => {
      this.userRef.doc(id).get().then((doc) => {
        let data = doc.data();
        observer.next({
          key: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone
        });
      });
    });
  }
}
