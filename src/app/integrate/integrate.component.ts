import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../_services/auth.service';
@Component({
  selector: 'app-integrate',
  templateUrl: './integrate.component.html',
  styleUrls: ['./integrate.component.css']
})
export class IntegrateComponent implements OnInit, OnDestroy {
  change;
  userData: any = {};
  currentUserSubscription: Subscription;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, public _api: ApiService, public _auth: AuthService) {
    // hold-transition skin-blue sidebar-mini
    document.body.classList.add('hold-transition');
    document.body.classList.add('skin-blue');
    document.body.classList.add('sidebar-mini');

    this.currentUserSubscription = this._auth.currentUser.subscribe(user => {
      this.userData = user;
      console.log(this.userData);
    });


    this.activatedRoute.params.subscribe(params =>
      this._api.livePage = params['pageName'] ? params['pageName'] : 'dashboard'
    );
  }

  ngOnInit() {
  }

  // left side bar clicked event
  leftSideBarClicked(event) {
    this._api.livePage = event;
    this.change = new Date();
    this.router.navigate(['/' + event]);
  }

  // header clicked event
  headerClicked(event) {
    this._api.livePage = event;
    this.change = new Date();
    this.router.navigate(['/' + event]);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

}
