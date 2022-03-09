import { Component, OnInit } from '@angular/core';
// Api Service
import { ApiService } from '../_services/api.service';
// custom settings Import
import { AppSettings } from '../app.settings';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css']
})
export class UserProjectsComponent implements OnInit {

  projectListStatus = true;
  buttonStatus = true;
  title: String = 'List Of Projects';
  isSubmitted = false;
  projectsList = [];
  userData: any;
  statusInfo = [];
  singleProject = [];
  projectInfo = [];
  timeSheetList = [];
  response: any;
  constructor(
    public _api: ApiService
  ) {
  }

  ngOnInit() {
    this.statusInfo = AppSettings.projectStatus;
    this.projectInfo = AppSettings.projectType;
    this.getProjectsList();
   // this.getTimeLimitsData();
  }

  backToList() {
    this.title = 'List Of Projects';
    this.projectListStatus = true;
    this.singleProject = [];
  }

  showViewForm(data) {
    this.title = data.title + ' Project';
    this.projectListStatus = false;
    this.singleProject = data;
  }


  // list of projects
  getProjectsList() {
    this._api.getUserProjectsList({})
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data;
        },
        error => {
          // console.log(error);
        });
  }

}
