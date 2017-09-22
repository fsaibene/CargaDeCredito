import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { AuthService } from '../../auth.service';
import { NavService } from '../../nav.service';
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  constructor(private ns : NavService, public serviceLogged : AuthService, public toastCtrl: ToastController, private authAf : AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
  }
  login(user: User) {
    if(this.allFilled()){
      try {
        this.authAf.auth.signInWithEmailAndPassword(user.email, user.password)
          .then(result => {
            this.serviceLogged.isLogged$.next(true);
            this.ns.setNavRoot(this.navCtrl);
            this.toastCtrl.create({message: "Bienvenido a Carga de crédito!", duration: 2500}).present();
            this.navCtrl.setRoot(TabsPage)})
          .catch(error =>{this.showToast(error.message)})
        } catch (error) {
            if(error.code == "auth/argument-error"){
              var mailError = "Formato de mail incorrecto";
              console.log(mailError);
              this.showToast(mailError);
            }
        }
    } else {
    this.toastCtrl.create({message: "Debe completar todos los campos", duration: 1500}).present();
    }
  }

  showToast(mensaje: string) {
    switch(mensaje)
    {
      case "The email address is badly formatted.":
      {
        mensaje = "El mail no es correcto";
        break;
      }
      case "The password is invalid or the user does not have a password.":
      {
        mensaje = "Clave incorrecta";
      }
    }
    this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    }).present();
  }  
  register(){
    this.navCtrl.push(RegisterPage);
  }

  private allFilled(): boolean {
    return(this.user.email == "" || this.user.password == "")
  }
}
