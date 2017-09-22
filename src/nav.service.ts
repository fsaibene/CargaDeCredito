import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Injectable()
export class NavService {
    contentNavCtrl: NavController;
    constructor(private afAuth: AngularFireAuth) {
    }
    public setNavRoot(root: NavController): void {
        this.contentNavCtrl = root;
    }

    public getNavRoot(): NavController {
        return this.contentNavCtrl;
    }

}