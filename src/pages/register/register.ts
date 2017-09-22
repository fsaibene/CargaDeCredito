import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController, AlertController  } from 'ionic-angular';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;
  passRepetido: string;

  constructor(private authAf: AngularFireAuth,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
  }

  register(user: User, passRepetido: string){
    if(passRepetido != user.password){
      console.log("if1");
      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Las contraseñas no coinciden',
        buttons: ['Ok']
      }).present();
    } else if(passRepetido == "" || user.password == "" || user.email == ""){
      console.log("if2");
      this.toastCtrl.create({
        message: "Debe completar todos los campos",
        duration: 2000
      }).present();
    } else {
      console.log("if3");
        this.authAf.auth.createUserWithEmailAndPassword(user.email, user.password)
        .then(r => { 
          this.toastCtrl.create({message: "Usuario registrado con éxito!", duration: 3000}).present(); 
          this.navCtrl.setRoot(LoginPage);
        })
        .catch(e => {
          this.toastCtrl.create({message: "Error al registrarse", duration: 1500}).present();
        });
      }
    }
  }
