import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
// Api Service
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.service';
// custom settings Import
import { AppSettings } from '../app.settings';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() change;
  photo_url;
  userData: any = {};
  roleInfo = [];
  response: any;
  // @Output()
  @Output() headerClicked = new EventEmitter();
  constructor(
    public _api: ApiService,
    public _auth: AuthService
  ) {
    this._auth.profileInfo.subscribe(res => {
      this.userData = this._auth.currentUserProfileInfo;
    });
  }

  ngOnInit() {
    this.getUserProfile();
    this.roleInfo = AppSettings.role;
  }

  headerClick(type) {
    this.change = new Date();
    this.headerClicked.emit(type);
  }

  signOut() {
    this._auth.clearData();
  }

  // get user details
  getUserProfile() {
    this._api.getUserById({})
      .subscribe(
        data => {
          this.response = data;
          this.userData = this.response.data;
        },
        error => {
        });
  }
}
