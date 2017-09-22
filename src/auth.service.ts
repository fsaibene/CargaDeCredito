import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  isLogged$ = new BehaviorSubject<boolean>(false);
  constructor(private afAuth: AngularFireAuth) {
  }

}