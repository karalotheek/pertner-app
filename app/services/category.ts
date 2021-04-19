import { Observable } from 'rxjs';
import Firebase from "@firebase/index";

const catRef = Firebase.firestore().collection('categories');

export const getActiveCategories = async () => {
  return new Promise((res, rej) => {
    catRef.onSnapshot((querySnapshot) => {
      let cat = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        if (data.active) {
          data.key = doc.id;
          cat.push(data);
        }
      });
      cat.sort((a, b) => a.index - b.index);
      res(cat);
    });
  });
}
export const getCategory = (id: string) => {
  return new Observable((observer) => {
    catRef.doc(id).get().then((doc) => {
      let data = doc.data();
      data.key = doc.id,
        observer.next(data);
    });
  });
}