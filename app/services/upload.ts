import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private basePath = '/uploads';
  fileName = '';
  filePath = '';
  constructor(private storage: AngularFireStorage) { }

  // from ==> category or service
  // type => small or large

  uploadImage(image, from, type): Observable<any> {

    let date = new Date();
    let id = date.getTime().toString();
    this.fileName = (type ? type : '') +'pic' + id + '.jpg';
    this.filePath = this.basePath + '/' + from + '/' + this.fileName;

    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(this.filePath).putString(image, 'data_url');


    uploadTask.on('state_changed', function (snapshot) {

      // let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log('Upload is ' + progress + '% done');
      // switch (snapshot.state) {
      //   case firebase.storage.TaskState.PAUSED: // or 'paused'
      //     console.log('Upload is paused');
      //     break;
      //   case firebase.storage.TaskState.RUNNING: // or 'running'
      //     console.log('Upload is running');
      //     break;
      // }
    }, function (error) {
      // console.log(error);
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        // console.log('File available at', downloadURL);
        // callBack(downloadURL, bucketIndex, imageIndex);
      });
    });

    return new Observable((observer) => {
      uploadTask.on('state_changed', function (snapshot) {

        // let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        // switch (snapshot.state) {
        //   case firebase.storage.TaskState.PAUSED: // or 'paused'
        //     console.log('Upload is paused');
        //     break;
        //   case firebase.storage.TaskState.RUNNING: // or 'running'
        //     console.log('Upload is running');
        //     break;
        // }
      }, function (error) {
        // console.log(error);
      }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          observer.next(downloadURL);
          // callBack(downloadURL, bucketIndex, imageIndex);
        });
      });
    });
  }
  
  deleteImage(imageUrl) {
    this.storage.storage.refFromURL(imageUrl).delete();
  }


}
