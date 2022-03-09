import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-employee-hourly-time-approval-status',
  templateUrl: './employee-hourly-time-approval-status.component.html',
  styleUrls: ['./employee-hourly-time-approval-status.component.css']
})
export class EmployeeHourlyTimeApprovalStatusComponent implements OnInit {

  title: String = 'List of Hourly Time Approvals';
  dailyListApproval = true;
  dailyList = [];
  todayDailyList = [];
  isSubmitted = false;
  response: any;
  approvedListStatus = true;
  selectedUser: any;
  p: number = 1;
  projectManagerApproved: any;

  constructor(public _api: ApiService) {
  }

  ngOnInit() {
    this.getEmployeeHourlyTimeApprovalStatus();
  }

   // list of users
   getEmployeeHourlyTimeApprovalStatus() {
    this._api.getEmployeeHourlyTimeApprovalStatus()
      .subscribe(
        data => {
          this.response = data;
          this.dailyList = this.response.data;
        },
        error => {
        });
  }
}
