import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { UtilService } from './util'

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private utilService: UtilService) { }

  bookingRef = firebase.firestore().collection('bookings');
  paymentRef = firebase.firestore().collection('payments');

  saveBooking(data): Observable<any> {
    data.createdOn = new Date();
    data.modifiedOn = new Date();
    return new Observable((observer) => {
      this.bookingRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }
  getBookingsByPhone(phone): Observable<any> {
    return new Observable((observer) => {
      this.bookingRef.onSnapshot((querySnapshot) => {
        let user = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (data.phone == phone) {
            data.key = doc.id;
            data.bookingDateNewDate = this.utilService.timeStampToNewDate(data.bookingDate);
            data.displayDate = this.utilService.formatDate(data.bookingDateNewDate, 3);
            data.displayTime = this.utilService.formatTime(data.bookingDateNewDate);
            user.push(data);
          }
        });
        observer.next(user);
      });
    });
  }
  getBookingCount(): Observable<any> {
    return new Observable((observer) => {
      this.bookingRef.onSnapshot((querySnapshot) => {
        observer.next(querySnapshot.size);
      });
    });
  }
  canceleBooking(id, remark): Observable<any> {
    return new Observable((observer) => {
      this.bookingRef.doc(`/${id}`).update({ 'cancelationRemark': remark, 'status': 'Cancelled' }).then(() => {
        observer.next();
      });
    });
  }
  updateBookingPaymentStatus(id, value, bookingData: any): Observable<any> {
    let totalPaidAmount = bookingData.paidAmount + bookingData.paymentAmount;
    let settledAmount = ((bookingData.total - totalPaidAmount) <= 0) ? 0 : (bookingData.total - totalPaidAmount);
    let status = settledAmount != 0 ? 'Pending' : 'Paid';
    return new Observable((observer) => {
      this.bookingRef.doc(`/${id}`).update({ 'paymentStatus': status, 'paidAmount': totalPaidAmount, 'settledAmount': settledAmount }).then(() => {
        observer.next();
      });
    });
  }
  getPaymentDetails(bookingId): Observable<any> {
    return new Observable((observer) => {
      this.paymentRef.where('ORDERID', '==', bookingId).get().then((querySnapshot) => {
        let payments = []
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.key = doc.id;
          payments.push(data);
        })
        observer.next(payments);
      })
    })
  }
  getBookingByInvoiceId(invoiceId): Observable<any> {
    return new Observable((observer) => {
      this.bookingRef.where('invoiceId', '==', invoiceId).get().then((querySnapshot) => {
        let booking = []
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.key = doc.id;
          data.bookingDateNewDate = this.utilService.timeStampToNewDate(data.bookingDate);
          data.displayDate = this.utilService.formatDate(data.bookingDateNewDate, 3);
          data.displayTime = this.utilService.formatTime(data.bookingDateNewDate);
          booking.push(data);
        })
        observer.next(booking);
      })
    })
  }
  submitFeedback(id, data): Observable<any> {
    return new Observable((observer) => {
      this.bookingRef.doc(`/${id}`).update({ 'feedback': data }).then(() => {
        observer.next();
      });
    });
  }
}
