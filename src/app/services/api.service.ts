import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';

// FIREBASE
import firebase from 'firebase/app';

export interface Iincident {
  photoUrl: string;
  incidentDetails: string;
  email: string;
  officer_id: string;
  officer_dataKey: string;
  status: string;
  timestamp?: any;
  coords: {
    latitude: number;
    longitude: number;
    timestamp: any;
  }
}

export interface Iofficer {
  id: string;
  email: string;
  full_name: string;
  gender: string;
  latitude: number;
  longitude: number;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private locationSource = new BehaviorSubject('');
  currentLocation = this.locationSource.asObservable();
  options: GeolocationOptions;
  currentPos: Geoposition;

  constructor(
    private afStore: AngularFirestore,
    private geolocation: Geolocation
  ) {
    this.getUserPosition().then(pos => {
      this.updateLocation(pos);
    })
  }

  updateLocation(location: any) {
    this.locationSource.next(location);
  }

  getUserPosition() {
    this.options = {
      enableHighAccuracy: false
    };
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
        this.currentPos = pos;
        console.log(pos);
        resolve(pos);
        // this.addMap(pos.coords.latitude, pos.coords.longitude);
      }, (err: PositionError) => {
        console.log("error : " + err.message);
        reject(err);
      });
    })
  }

  /**
  *
  * @param _imageBlobInfo
  */
  uploadToFirebase(_imageBlobInfo) {
    console.log("uploadToFirebase");
    const randomId = Math.random()
      .toString(36)
      .substring(2, 8);
    return new Promise((resolve, reject) => {
      let fileRef = firebase.storage().ref(`files/${new Date().getTime()}_${randomId}`);
      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      uploadTask.on(
        "state_changed",
        (_snapshot: any) => {
          console.log(
            "snapshot progess " +
            (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100
          );
        },
        _error => {
          console.log(_error);
          reject(_error);
        },
        () => {
          // completion...
          resolve(uploadTask.snapshot);
        }
      );
    });
  }

  async addIncident(data: any) {
    try {
      data.coords = {
        latitude: this.currentPos.coords.latitude,
        longitude: this.currentPos.coords.longitude,
        timestamp: this.currentPos.timestamp
      };
      data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const officers = await this.officerList();
      data.officer_id = officers[0].id;
      data.officer_dataKey = officers[0]._id;
      console.log('firebase incident', data);
      await this.afStore.collection('officers').doc(officers[0]._id).update({
        status: true
      });
      const doc = await this.afStore.collection('incidents').add(data);
      return doc;
    } catch (error) {
      return error;
    }
  }

  getIncidents$ = this.afStore.collection('incidents', ref => ref.orderBy('timestamp', 'desc').limit(10)).valueChanges();

  officerList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afStore.collection<Iofficer>('officers', ref => ref.where('status', '==', false).limit(1)).get().subscribe(querySnapshot => {
        const query = [];
        querySnapshot.forEach((doc) => {
          query.push({ ...doc.data(), _id: doc.id });
        });
        console.log('officer info', query);
        resolve(query);
      });
    });
  }

  saveBatch() {
    const db = firebase.firestore();
    let batch = db.batch();
    const docs = [];
    docs.forEach((doc) => {
      let docRef = db.collection('officers').doc();
      batch.set(docRef, doc);
    })
    return batch.commit();
  }
}
