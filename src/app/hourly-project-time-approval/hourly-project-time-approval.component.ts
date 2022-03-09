import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-hourly-project-time-approval',
  templateUrl: './hourly-project-time-approval.component.html',
  styleUrls: ['./hourly-project-time-approval.component.css']
})
export class HourlyProjectTimeApprovalComponent implements OnInit {

  title: String = 'List Of Employee Hourly Time Approvals';
  dailyListApproval = true;
  dailyList = [];
  todayDailyList = [];
  sortedItems = [];
  isSubmitted = false;
  response: any;
  approvedListStatus = true;
  selectedId: any;
  p: number = 1;
  modalRef: BsModalRef;
  projectManagerApproved: any;
  constructor(public _api: ApiService, private modalService: BsModalService, private toastr: ToastrService) {
   }

  ngOnInit() {
    this.getEmployeeHourlyProjectTimeApproval();
  }

   // list of users
   getEmployeeHourlyProjectTimeApproval() {
    this._api.getEmployeeHourlyProjectTimeApproval()
      .subscribe(
        data => {
          this.response = data;
          this.dailyList = this.response.data;
        },
        error => {
        });
  }

  openModal(template: TemplateRef<any> , dailyStatus) {
    this.modalRef = this.modalService.show(template);
    this.selectedId = dailyStatus;
  }

  onChange(event) {
    this.projectManagerApproved = event;
  }

  confirm() {
    this.isSubmitted = true;
    this._api.updateHourlyTimeApprovalStatus({ id: this.selectedId.id, approved: this.projectManagerApproved })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getEmployeeHourlyProjectTimeApproval();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
        this.close();
   }

   close() {
    this.modalRef.hide();
    this.selectedId = null;
    this.getEmployeeHourlyProjectTimeApproval();
   }
}
