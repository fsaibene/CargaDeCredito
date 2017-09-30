import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController, Loading, LoadingController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  valid = new  BehaviorSubject<boolean>(false);
  selectedUser: string;
  constructor(
    private ns : NavService,
    public serviceLogged : AuthService,
    public toastCtrl: ToastController,
    private authAf : AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController  
  ) {
    
  }
  async login(user: User) {
    this.allFilled();
    if(this.valid.value){
      try {
        let loading = this.loadSpinner();
        loading.present();
        await this.authAf.auth.signInWithEmailAndPassword(user.email, user.password)
          .then(result => {
            this.serviceLogged.isLogged$.next(true);
            this.ns.setNavRoot(this.navCtrl);
            //this.toastCtrl.create({message: "Bienvenido a Carga de crédito!", duration: 2500}).present();
            this.navCtrl.setRoot(HomePage)})
          .catch(error => {
            loading.dismiss();
            this.showToast(error.message);
          })
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
        break;
      }
      case "There is no user record corresponding to this identifier. The user may have been deleted.":
      {
        mensaje = "No existe un usuario con ese email.";
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

  private allFilled(): void {
    this.valid.next(this.user.email != "" && this.user.password != "");
  }

  public isInvalid(): boolean{
    return (this.user.email == undefined || this.user.password == undefined || this.user.password == "" || this.user.email == "");
  }

  SeleccionarUsuario(){
    switch(this.selectedUser){
      case "admin":{
        this.user.email="admin@admin.com";
        this.user.password="111111";
        break;
      }
      case "usuario":{
        this.user.email="usuario@usuario.com";
        this.user.password="333333";
        break;
      }
      case "invitado":{
        this.user.email="invitado@invitado.com";
        this.user.password="222222";
        break;
      }                
      case "jugador1":{
        this.user.email="j1@jugador.com";
        this.user.password="444444";
        break;
      }
      case "jugador2":{
        this.user.email="j2@jugador.com";
        this.user.password="555555";
        break;
      }        
    }
  }
  private loadSpinner():Loading
  {
    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content:"Cargando..",
      duration: 2500
      
    });
    return loader;
  }
}
