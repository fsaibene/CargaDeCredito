import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../auth.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnDestroy, OnInit {
  isLogged: boolean;
  tab1Root = HomePage;

  constructor(afAuth : AngularFireAuth, public authServ: AuthService) {
    this.isLogged = this.authServ.isLogged$.value;
  }
  public ngOnInit(): void{
  }
  public ngOnDestroy(): void {
    this.isLogged = false;
    this.authServ.isLogged$.next(false);
  }
}
