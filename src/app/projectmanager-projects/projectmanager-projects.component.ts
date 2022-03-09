import { Component, OnInit } from '@angular/core';
// Api Service
import { ApiService } from '../_services/api.service';
// custom settings Import
import { AppSettings } from '../app.settings';
import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'app-projectmanager-projects',
  templateUrl: './projectmanager-projects.component.html',
  styleUrls: ['./projectmanager-projects.component.css']
})
export class ProjectmanagerProjectsComponent implements OnInit {

  projectListStatus = true;
  buttonStatus = true;
  title: String = 'List Of Projects';
  isSubmitted = false;
  projectsList = [];
  userData: any;
  statusInfo = [];
  singleProject = [];
  projectInfo = [];
  response: any;
  constructor(
    public _api: ApiService
  ) {
  }

  ngOnInit() {
    this.statusInfo = AppSettings.projectStatus;
    this.projectInfo = AppSettings.projectType;
    this.getProjectsList();
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
    this._api.getProjectManagerProjectsList({})
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data;
        },
        error => {
        });
  }

}
