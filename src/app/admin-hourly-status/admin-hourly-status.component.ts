import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AlertService } from '../_services/alert.service';

import * as moment from 'moment';

@Component({
  selector: 'app-admin-hourly-status',
  templateUrl: './admin-hourly-status.component.html',
  styleUrls: ['./admin-hourly-status.component.css']
})
export class AdminHourlyStatusComponent implements OnInit {

  title: String = 'YPoint Hourly Status';
  response: any;
  usersList: [];
  projectsList: [];
  singleUser = [];
  viewStatus = false;
  isSubmitted = false;
  hourlyStatusForm: FormGroup;
  hourlyStatusData = [];
  createdDate = [];
  checkin = [];
  checkout = [];

  constructor(public _api: ApiService,
    private alertService: AlertService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.inithourlyStatus();
    this.getUsersList();
    this.getProjectsList();
  }

  inithourlyStatus() {
    this.hourlyStatusForm = this.fb.group({
      users: ['', [Validators.required]],
      projects: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  get getUsers() { return this.hourlyStatusForm.get('users'); }
  get Date() { return this.hourlyStatusForm.get('date'); }
  get getProjects() { return this.hourlyStatusForm.get('projects'); }

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

  // // list of daily status
  // getAdminDailyStatus() {
  //   this.isSubmitted = true;
  //   if (!this.hourlyStatusForm.valid) {
  //     return;
  //   }
  //   console.log(this.hourlyStatusForm.value);
  //   this._api.getAdminDailyStatus(this.hourlyStatusForm.value)
  //     .subscribe(
  //       data => {
  //         this.response = data;
  //         this.viewStatus = true;
  //         this.dailyStatusData = this.response.data;
  //         console.log('dailyStatusData', this.dailyStatusData);
  //       },
  //       error => {
  //       });
  // }

  // list of employee hourly status
  getAdminHourlyStatus() {
    this.isSubmitted = true;
    if (!this.hourlyStatusForm.valid) {
      return;
    }
    this._api.getAdminHourlyStatus(this.hourlyStatusForm.value)
      .subscribe(
        data => {
          this.response = data;
          this.viewStatus = true;
          this.hourlyStatusData = this.response.data;
          // var res = this.hourlyStatusData;
          // for (let i = 0; i < res.length; i++) {
          //   console.log('res[i].created_date', res[i].created_date);
          //   this.createdDate[i] = moment.utc(res[i].created_date).local().format('YYYY-MM-DD, HH:mm');
          //   this.checkin[i] = moment.utc(res[i].checkin_time).local().format('YYYY-MM-DD, HH:mm');
          //   this.checkout[i] =  moment.utc( res[i].checkout_time).local().format('YYYY-MM-DD, HH:mm');
          // }
          // console.log('created date', this.createdDate);
          // console.log('checkin', this.checkin);
          // console.log('checkout', this.checkout);
        },
        error => {
        });
  }

 // list of all hourly projects
 getProjectsList() {
  this._api.getAllAdminHourlyProjectsList()
    .subscribe(
      data => {
        this.response = data;
        this.projectsList = this.response.data;
      },
      error => {
      });
}

}
