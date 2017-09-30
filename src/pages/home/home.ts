import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database"; 
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { LoginPage } from '../../pages/login/login';
import { AuthService } from '../../auth.service';
import { NavService } from '../../nav.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit, OnDestroy {
  scannedCode: string;
  scannedCodes: Array<string>;
  countCodes: number;
  lista: FirebaseListObservable<any>;
  listaDB: Array<string>;
  subLista: Subscription;

  constructor(private ns: NavService,
     public toastCtrl: ToastController,
      public navCtrl: NavController, 
      private authAf : AngularFireAuth, 
      public authService : AuthService,
      public barcodeScanner: BarcodeScanner,
      public af: AngularFireDatabase,
      public alertCtrl: AlertController
    ) {
      this.lista = af.list('/codes', { preserveSnapshot: true});
      this.scannedCodes = new Array<string>();
      this.listaDB = new Array<string>();
      this.subLista = this.lista.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
            this.listaDB.push(snapshot.val());
          });
        });
      this.scannedCodes.push("8c95def646b6127282ed50454b73240300dccabc");
      this.scannedCodes.push("ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172");
  }
  public ngAfterViewInit(){
  }

  public ngOnDestroy(){
    this.subLista.unsubscribe();
  }
  
  logout(){
    const alert = this.alertCtrl.create({
      title: 'Atención!',
      message: 'Seguro desea cerrar sesión?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.authService.isLogged$.next(false);
            this.authAf.auth.signOut();
            this.ns.getNavRoot().setRoot(LoginPage);    
          }
        },
        {
          text: 'No'
        }
      ]
    });
    alert.present();
  }

  async scanCode(){
    const result = await this.barcodeScanner.scan({showTorchButton: true});
    this.scannedCode = await result.text;
    this.scannedCodes.push(this.scannedCode);
  }
  
  VerifyCode(code: string): boolean{
    var retorno = true;
    this.listaDB.forEach(a => {
      if (a == code) {
        retorno = false;
      }
    });
    return retorno;
  }

  showToastError(message:string){
    this.toastCtrl.create({
      message: message,
      duration: 1800,
      cssClass:"ErrorToast"
    }).present();
  }

  showToastOk(message:string){
    this.toastCtrl.create({
      message: message,
      duration: 1800,
      cssClass:"OkToast"
    }).present();
  }

  Cargar(){
    if (this.scannedCodes.length > 0) {
        this.scannedCodes.forEach(code => {
          if(this.VerifyCode(code)){
            this.lista.push(code).then(r => {
              this.showToastOk("Carga Exitosa de codigo: "+ code);
            }).catch(e => {
              this.showToastError("Error al cargar");
            });
          } else {
            this.toastCtrl.create({
              message: "Codigo"+ code +" ya utilizado, no se cargará...",
              position: 'top',
              cssClass:"ErrorToast",
              duration: 1800
            }).present();
          }
        });
        this.scannedCodes = new Array<string>();
      } else {
        this.showToastError("No hay códigos cargados.");
      }
  }
}
