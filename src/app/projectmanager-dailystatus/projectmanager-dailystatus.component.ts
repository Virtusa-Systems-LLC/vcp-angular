import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-projectmanager-dailystatus',
  templateUrl: './projectmanager-dailystatus.component.html',
  styleUrls: ['./projectmanager-dailystatus.component.css']
})
export class ProjectmanagerDailystatusComponent implements OnInit {

  title: String = 'YPoint Daily Status';
  response: any;
  usersList: [];
  projectsList: [];
  singleUser = [];
  viewStatus = false;
  isSubmitted = false;
  dailyStatusForm: FormGroup;
  dailyStatusData = [];

  constructor(public _api: ApiService,
    private alertService: AlertService,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.initDailyStatus();
    this.getUsersList();
    this.getProjectManagerEmployeesProjectsList();
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
    this._api.employeesList()
      .subscribe(
        data => {
          this.response = data;
          this.usersList = this.response.data;
        },
        error => {
          // console.log(error);
        });
  }

    // list of projects
    getProjectManagerEmployeesProjectsList() {
      this._api.getProjectManagerEmployeesProjectsList()
        .subscribe(
          data => {
            this.response = data;
            this.projectsList = this.response.data;
          },
          error => {
          });
    }

  // list of daily status
  getProjectManagerDailyStatus() {
    this.isSubmitted = true;
    if (!this.dailyStatusForm.valid) {
      return;
    }
    this._api.getProjectManagerDailyStatus(this.dailyStatusForm.value)
      .subscribe(
        data => {
          this.response = data;
          this.viewStatus = true;
          this.dailyStatusData = this.response.data;
        },
        error => {
          // console.log(error);
        });
  }

}
