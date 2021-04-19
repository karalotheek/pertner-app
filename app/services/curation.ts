import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { UtilService } from "./util";
@Injectable({
  providedIn: 'root'
})
export class CurationService {
  // curation CRUD
  curnRef = firebase.firestore().collection('curations');

  constructor(private UtilService: UtilService) { }

  getActiveCurations(): Observable<any> {
    return new Observable((observer) => {
      this.curnRef.onSnapshot((querySnapshot) => {
        let curn = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (data.active) {
            data.key = doc.id;
            data.fromDate = this.UtilService.timeStampToNewDate(data.fromDate);
            data.toDate = this.UtilService.timeStampToNewDate(data.toDate);
            data.fromTime = this.UtilService.timeStampToNewDate(data.fromTime);
            data.toTime = this.UtilService.timeStampToNewDate(data.toTime);
            curn.push(data);
          }
        });
        curn.sort((a, b) => a.index - b.index);
        observer.next(curn);
      });
    });
  }
  getCurations(): Observable<any> {
    return new Observable((observer) => {
      this.curnRef.onSnapshot((querySnapshot) => {
        let curn = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.key = doc.id;
          data.fromDate = this.UtilService.timeStampToNewDate(data.fromDate);
          data.toDate = this.UtilService.timeStampToNewDate(data.toDate);
          data.fromTime = this.UtilService.timeStampToNewDate(data.fromTime);
          data.toTime = this.UtilService.timeStampToNewDate(data.toTime);
          curn.push(data);
        });
        curn.sort((a, b) => a.index - b.index);
        observer.next(curn);
      });
    });
  }

  getCurationById(id: string): Observable<any> {
    return new Observable((observer) => {
      this.curnRef.doc(id).get().then((doc) => {
        let data = doc.data();
        data.key = doc.id;
        observer.next(doc);
      });
    });
  }

  postCuration(data): Observable<any> {
    return new Observable((observer) => {
      this.curnRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }

  updateCuration(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.curnRef.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  deleteCuration(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.curnRef.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }

}
