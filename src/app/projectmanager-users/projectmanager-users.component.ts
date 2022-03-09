import { Component, OnInit, TemplateRef } from '@angular/core';
// Api Service
import { ApiService } from '../_services/api.service';
// custom settings Import
import { AppSettings } from '../app.settings';


@Component({
  selector: 'app-projectmanager-users',
  templateUrl: './projectmanager-users.component.html',
  styleUrls: ['./projectmanager-users.component.css']
})
export class ProjectmanagerUsersComponent implements OnInit {

  usersListStatus = true;
  buttonStatus = true;
  title: String = 'List Of Employees';
  isSubmitted = false;
  usersList = [];
  userData: any;
  statusInfo = [];
  singleProject = [];
  response: any;

  constructor(
    public _api: ApiService
  ) {
  }

  ngOnInit() {

    this.getUsersList();
  }

  // list of users
  getUsersList() {
    this._api.getprojectManagerusersList({})
      .subscribe(
        data => {
          this.response = data;
          this.usersList = this.response.data;
        },
        error => {
        });
  }
}
