import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { UtilService } from './util'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import GlobalConstants from "src/app/constants";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'mode': 'cors', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' })
};

const httpOptionsForSMS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OtherService {

  constructor(private utilService: UtilService, public http: HttpClient) { }

  enquiryRef = firebase.firestore().collection('enquiry');
  consultationRef = firebase.firestore().collection('consultations');
  deptRef = firebase.firestore().collection('departments');
  notificationRef = firebase.firestore().collection('notifications');

  submitEnquiry(data): Observable<any> {
    data.createdOn = new Date();
    data.modifiedOn = new Date();
    data.status = 'Pending';
    return new Observable((observer) => {
      this.enquiryRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }
  submitQuotation(data): Observable<any> {
    data.createdOn = new Date();
    data.modifiedOn = new Date();
    data.status = 'Pending';
    return new Observable((observer) => {
      this.consultationRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }
  getActiveDepartments(): Observable<any> {
    return new Observable((observer) => {
      this.deptRef.onSnapshot((querySnapshot) => {
        let dept = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data.key = doc.id;
          if (data.active) dept.push(data);
        });
        observer.next(dept);
      });
    });
  }
  getActiveNotifications(userId): Observable<any> {
    return new Observable((observer) => {
      this.notificationRef.onSnapshot((querySnapshot) => {
        let notification = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (data.userId == userId && !data.isSeen) {
            data.key = doc.id;
            data.notificationDateNewDate = this.utilService.timeStampToNewDate(data.createdOn);
            data.displayDate = this.utilService.formatDate(data.notificationDateNewDate, 2);
            data.displayTime = this.utilService.formatTime(data.notificationDateNewDate);
            notification.push(data);
          }
        });
        observer.next(notification);
      });
    })
  }
  updateNotificationStatus(id, status): Observable<any> {
    return new Observable((observer) => {
      this.notificationRef.doc(`/${id}`).update({ 'isSeen': status }).then(() => {
        observer.next();
      });
    });
  }
  sendSMSNotification(phone, content) {
    return new Promise((res, rej) => {
      this.http.post(GlobalConstants.SEND_SMS_API_URL, JSON.stringify({ phone, content }), httpOptionsForSMS).subscribe((response) => { res(response) });
    })
  }
  sendWAppNotification(phone, content) {
    return new Promise((res, rej) => {
      this.http.post(GlobalConstants.SEND_WHATSAPP_MSG_API_URL, JSON.stringify({ phone, content }), httpOptionsForSMS).subscribe((response) => { res(response) });
    })
  }
  sendInAppNotificationToUser(status, bookingDetails, userDetails) {
    let payload = {
      title: "Thank you for booking",
      body: "Your booking has been placed on TheekKaralo App. Your booking Id is" + bookingDetails.invoiceId + ". For more details check in profile section. https://theekkaralo.com/",
      click_action: "https://theekkaralo-qa.web.app/myaccount/1",
      icon: "https://firebasestorage.googleapis.com/v0/b/theekkaralo-qa.appspot.com/o/uploads%2Fdefault%2Ficon-512x512.png?alt=media&token=58ed7f2c-2053-47df-a032-c205f0eb9e00",
      // image: "https://firebasestorage.googleapis.com/v0/b/theekkaralo-qa.appspot.com/o/uploads%2Fdefault%2Ficon-512x512.png?alt=media&token=58ed7f2c-2053-47df-a032-c205f0eb9e00",
      mobileToken: '',
      desktopToken: '',
    }
    payload.mobileToken = userDetails.mobileFcmToken;
    payload.desktopToken = userDetails.desktopFcmToken;
    if (status === 'Accepted') {
      payload.body = "Your booking " + bookingDetails.invoiceId + " has been accepted on TheekKaralo App. For more details check in profile section. https://theekkaralo.com/"
    } else if (status === 'Rejected') {
      payload.body = "Your booking" + bookingDetails.invoiceId + " has been rejected on TheekKaralo App. For more details check in profile section. https://theekkaralo.com/"
    } else if (status === 'Cancelled') {
      payload.body = "Your booking" + bookingDetails.invoiceId + " has been cancelled on TheekKaralo App. For more details check in profile section. https://theekkaralo.com/"
    } else if (status === 'Completed') {
      payload.body = "Your booking" + bookingDetails.invoiceId + " has been completed on TheekKaralo App. For more details check in profile section. https://theekkaralo.com/"
    }

    this.sendSMSNotification(userDetails.phone, payload.body).then((res) => console.log(res)).catch((error) => console.log(error))
    this.sendWAppNotification(userDetails.phone, payload.body).then((res) => console.log(res)).catch((error) => console.log(error))

    return new Observable((observer) => {
      // for FCM
      if (userDetails.desktopFcmToken || userDetails.mobileFcmToken) {
        this.http.post(GlobalConstants.IN_APP_NOTIFICATION_API_URL, JSON.stringify(payload), httpOptions).subscribe(() => { });
      }
      // send wapp msg
      // this.http.get("https://api.whatsapp.com/send?phone=+91" + userDetails.phone + "&text=" + window.encodeURIComponent(payload.body), httpOptions).subscribe((data) => {
      //   console.log('wapp msg send', data)
      // });
      // let shareUrl = "https://api.whatsapp.com/send?phone=91" + userDetails.phone + "&text=" + payload.body;
      // window.open(shareUrl, '_blank');
      // for in_app_notification 
      let msgBody = 'Thank you for your boking.';
      if (status === 'Placed') {
        msgBody = "Your booking request has been recieved successfully."
      } else if (status === 'Cancelled') {
        msgBody = "Your booking has been cancelled successfully."
      }
      var data = {
        userId: userDetails.key,
        invoiceId: bookingDetails.invoiceId,
        message: msgBody,
        createdOn: new Date(),
        modifiedOn: new Date(),
        isSeen: false,
        status: status,
        type: 'Booking'
      }
      this.notificationRef.add(data).then((doc) => {
        observer.next({
          key: doc.id,
        });
      });
    });
  }
}
