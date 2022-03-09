import { Component, OnInit } from '@angular/core';

import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-projectmanager-dashboard',
  templateUrl: './projectmanager-dashboard.component.html',
  styleUrls: ['./projectmanager-dashboard.component.css']
})
export class ProjectmanagerDashboardComponent implements OnInit {

  countData: any;
  response: any;
  constructor(
    public _api: ApiService
  ) {
    this.initCount();
  }

  ngOnInit() {

  }

  initCount() {

    this._api.getProjectManagerProjectsCountDashboard({})
      .subscribe(
        data => {
          this.response = data;
          this.countData = this.response.data[0];
        },
        error => {
        });
  }

}
