import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AlertService } from '../_services/alert.service';

import * as moment from 'moment';

@Component({
  selector: 'app-admin-daily-status',
  templateUrl: './admin-daily-status.component.html',
  styleUrls: ['./admin-daily-status.component.css']
})
export class AdminDailyStatusComponent implements OnInit {

  title: String = 'YPoint Daily Status';
  response: any;
  usersList: [];
  projectsList: [];
  singleUser = [];
  viewStatus = false;
  isSubmitted = false;
  dailyStatusForm: FormGroup;
  dailyStatusData = [];
  createdDate = [];

  constructor(public _api: ApiService,
    private alertService: AlertService,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.initDailyStatus();
    this.getUsersList();
    this.getProjectsList();
  }

  initDailyStatus() {
    this.dailyStatusForm = this.fb.group({
      users: ['', [Validators.required]],
      projects: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  get getUsers() { return this.dailyStatusForm.get('users'); }
  get Date() { return this.dailyStatusForm.get('date'); }
  get getProjects() { return this.dailyStatusForm.get('projects'); }

  // list of users
  getUsersList() {
    this._api.getEmployeesList()
      .subscribe(
        data => {
          this.response = data;
          this.usersList = this.response.data;
        },
        error => {
        });
  }

  // list of daily status
  getAdminDailyStatus() {
    this.isSubmitted = true;
    if (!this.dailyStatusForm.valid) {
      return;
    }
    console.log(this.dailyStatusForm.value);
    this._api.getAdminDailyStatus(this.dailyStatusForm.value)
      .subscribe(
        data => {
          this.response = data;
          this.viewStatus = true;
          this.dailyStatusData = this.response.data;
          // var res = this.dailyStatusData;
          // for (let i = 0; i < res.length; i++) {
          //   this.createdDate[i] = moment.utc(res[i].created_date).local().format('YYYY-MM-DD, HH:mm');
          // }
         // console.log('created date', this.createdDate);
        },
        error => {
        });
  }

 // list of projects
 getProjectsList() {
  this._api.getAllProjectsList()
    .subscribe(
      data => {
        this.response = data;
        this.projectsList = this.response.data;
      },
      error => {
      });
}

}
