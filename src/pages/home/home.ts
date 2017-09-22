import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { LoginPage } from '../../pages/login/login';
import { AuthService } from '../../auth.service';
import { NavService } from '../../nav.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnDestroy{
  welcomeSub : Subscription;
  constructor(private ns: NavService, public toastCtrl: ToastController, public navCtrl: NavController, private authAf : AngularFireAuth, public authService : AuthService) {
  }
  public ngAfterViewInit(){
    this.welcomeMessage();  
  }

  public ngOnDestroy(){
    this.welcomeSub.unsubscribe();
  }
  
  welcomeMessage(){
    this.welcomeSub = this.authAf.authState.subscribe(authState => {
      this.toastCtrl.create({
        message: "Bienvenido a APP_NAME ${data.email}",
        duration: 1500
      });
    })
  }
  logout(){
    this.authService.isLogged$.next(false);
    this.authAf.auth.signOut();
    this.ns.getNavRoot().setRoot(LoginPage);
  }
}
