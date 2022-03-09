import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-employee-time-approval-status',
  templateUrl: './employee-time-approval-status.component.html',
  styleUrls: ['./employee-time-approval-status.component.css']
})
export class EmployeeTimeApprovalStatusComponent implements OnInit {

  title: String = 'List Of Daily Time Approvals';
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
    this.getEmployeeDailyTimeApprovalStatus();
  }

   // list of users
   getEmployeeDailyTimeApprovalStatus() {
    this._api.getEmployeeDailyTimeApprovalStatus()
      .subscribe(
        data => {
          this.response = data;
          this.dailyList = this.response.data;
        },
        error => {
        });
  }

}
