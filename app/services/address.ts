import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor() { }
  userRef = firebase.firestore().collection('address');

  getAddressById(id): Observable<any> {
    return new Observable((observer) => {
      this.userRef.onSnapshot((querySnapshot) => {
        let user = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (doc.id == id) {
            data.key = doc.id;
            user.push(data);
          }
        });
        observer.next(user);
      });
    });
  }

  addAddress(data, status): Observable<any> {
    (status == 'booking') ? (data.type = 'Booking') : data.type = 'User';
    data.createdOn = new Date();
    data.modifiedOn = new Date();
    return new Observable((observer) => {
      this.userRef.add(data).then((doc) => {
        observer.next(doc.id);
      });
    });
  }
  getAddresses(id: string): Observable<any> {
    return new Observable((observer) => {
      this.userRef.doc(id).get().then((doc) => {
        let data = doc.data();
        data.key = doc.id;
        observer.next(data);
      });
    });
  }
}
