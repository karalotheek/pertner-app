import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  // service CRUD
  serviceRef = firebase.firestore().collection('services');

  getActiveServices(): Observable<any> {
    return new Observable((observer) => {
      this.serviceRef.onSnapshot((querySnapshot) => {
        let service = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (data.active) {
            data.key = doc.id;
            service.push(data);
          }
        });
        observer.next(service);
      });
    });
  }
  getServices(): Observable<any> {
    return new Observable((observer) => {
      this.serviceRef.onSnapshot((querySnapshot) => {
        let service = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.key = doc.id;
          service.push(data);
        });
        observer.next(service);
      });
    });
  }

  getService(id: string): Observable<any> {
    return new Observable((observer) => {
      this.serviceRef.doc(id).get().then((doc) => {
        let data = doc.data();
        data.key = doc.id;
        observer.next(data);
      });
    });
  }

  postService(data): Observable<any> {
    return new Observable((observer) => {
      this.serviceRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }

  updateService(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.serviceRef.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  deleteService(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.serviceRef.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }

  getServicesByCategory(categoryId): Observable<any> {
    return new Observable((observer) => {
      this.serviceRef.onSnapshot((querySnapshot) => {
        let service = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (data.categoryId == categoryId) {
            data.key = doc.id;
            service.push(data);
          }
        });
        observer.next(service);
      });
    });
  }
  getActiveServicesByCategory(categoryId): Observable<any> {
    return new Observable((observer) => {
      this.serviceRef.onSnapshot((querySnapshot) => {
        let service = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (data.categoryId == categoryId && data.active) {
            data.key = doc.id;
            service.push(data);
          }
        });
        observer.next(service);
      });
    });
  }
}
