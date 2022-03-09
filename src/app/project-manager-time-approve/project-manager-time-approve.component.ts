import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-project-manager-time-approve',
  templateUrl: './project-manager-time-approve.component.html',
  styleUrls: ['./project-manager-time-approve.component.css']
})
export class ProjectManagerTimeApproveComponent implements OnInit {

  title: String = 'List Of Employee Time Approvals';
  dailyListApproval = true;
  dailyList = [];
  todayDailyList = [];
  isSubmitted = false;
  response: any;
  approvedListStatus = true;
  selectedUser: any;
  p: number = 1;
  modalRef: BsModalRef;
  projectManagerApproved: any;
  constructor(public _api: ApiService, private modalService: BsModalService, private toastr: ToastrService) {
   }

  ngOnInit() {
    this.getEmployeeDailyStatusforTimeApproval();
  }

   // list of users
   getEmployeeDailyStatusforTimeApproval() {
    this._api.getEmployeeDailyStatusforTimeApproval()
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
    this.selectedUser = dailyStatus;
  }

  onChange(event) {
    this.projectManagerApproved = event;
  }

  confirm() {
    this.isSubmitted = true;
    this._api.updateTimeApprovalStatus({ id: this.selectedUser.id, approved: this.projectManagerApproved })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getEmployeeDailyStatusforTimeApproval();
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
    this.selectedUser = null;
    this.getEmployeeDailyStatusforTimeApproval();
   }

}
