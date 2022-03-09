import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.service';
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Input() change;
  // @Output()
  @Output() leftSideBarClicked = new EventEmitter();
  userData: any = {};
  projectsList: any = {};
  response: any;
  constructor(public _api: ApiService, public _auth: AuthService) {
    this._auth.profileInfo.subscribe(res => {
      this.userData = this._auth.currentUserProfileInfo;
    });
  }

  ngOnInit() {
    this.getUserProfile();
  }

  sidebarClick(type) {
    this.change = new Date();
    this.leftSideBarClicked.emit(type);
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

  // // list of projects
  // getProjectsList() {
  //   this._api.getProjectManagerProjectsList({})
  //     .subscribe(
  //       data => {
  //         this.response = data;
  //         this.projectsList = this.response.data;
  //       },
  //       error => {
  //       });
  // }
}
