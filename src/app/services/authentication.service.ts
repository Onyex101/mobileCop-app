import { Injectable, NgZone } from '@angular/core';
import { User } from './../shared/auth';
import firebase from 'firebase/app';
import { Router } from "@angular/router";
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { StorageService } from './storage.service';

// https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/amp/
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userdata: any;
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public storage: StorageService
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user && user.emailVerified) {
        this.userdata = user;
        console.log('user data', this.userdata);
        this.storage.set('user', JSON.stringify(this.userdata));
        this.isAuthenticated.next(true);
      } else {
        this.storage.set('user', null);
        this.isAuthenticated.next(false);
      }
    })
  }

  // login with email and password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  // register user with email and password
  RegisterUser(email, password) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  // email verification when new user registers
  SendVerificationMail() {
    // return firebase.auth().currentUser.sendEmailVerification().then(() => {
    //   this.router.navigateByUrl('/verify-email');
    // })
    return firebase.auth().currentUser.sendEmailVerification();
  }

  // recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // returns true when user is logged in
  get isLoggedIn(): boolean {
    const user: any = this.storage.get('user');
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // returns true when user email is verified
  get isEmailVerified(): boolean {
    const user: any = this.storage.get('user');
    return (user.emailVerified !== false) ? true : false;
  }

  // sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider())
  }

  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
    .then((result) => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/tabs/home');
      });
      this.SetUserData(result.user);
    })
    .catch((error) => {
      console.log('error', error);
    })
  }

  // store user in storage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // sign out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      this.storage.remove('user');
      this.router.navigateByUrl('/login', {replaceUrl: true})
    })
  }
}