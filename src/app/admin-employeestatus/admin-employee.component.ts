
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// Api Service
import { ApiService } from '../_services/api.service';
// Alert Service
import { AlertService } from '../_services/alert.service';
// custom settings Import
import { AppSettings } from '../app.settings';

import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-employee',
  templateUrl: './admin-employee.component.html',
  styleUrls: ['./admin-employee.component.css']
})
export class AdminEmployeeComponent implements OnInit {

  countData: any;
  adminDashboardlist: any;
  adminDashboardDelaylist: any ;
  projectsList : any ;
  nonBillableProjectsList : any ;
  activeProjectsList : any ;
  days : 4 ;
  response: any;
  constructor(
    public _api: ApiService
  ) {
    this.initCount();
  }

  ngOnInit() {
    // this.getAdminDashboardReport();
    // this.changeNumberOfDays(event);
    this.days = 4 ;
    this.getAdminDashboardDelayReport();
    this.getAdminDashboardReport();
    this.getProjectsList();
  }

  initCount() {

    this._api.getAdminCountsDashboard()
      .subscribe(
        data => {
          
          this.response = data;
          this.countData = this.response.data[0];
          // console.log('countData', this.countData);
        },
        error => {
        });
  }

  

  getAdminDashboardReport() {
    // const params = new HttpParams().set('days', this.days);
    // console.log('noo', this.days);
    this._api.getAdminDashboardReport(this.days)
      .subscribe(
        data => {
          this.response = data;
          // this.usersList2 = this.response.data;
          this.adminDashboardlist = this.response.data;

          // console.log(data);
        },
        error => {
        });
  }

  getAdminDashboardDelayReport() {
    this._api.getAdminDashboardDelayReport()
      .subscribe(
        data => {
          this.response = data;
          // this.usersList2 = this.response.data;
          this.adminDashboardDelaylist = this.response.data;

          // console.log(data);
        },
        error => {
        });
  }

  getProjectsList() {
    this._api.projectsList()
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data;
          // console.log('yes yes ',this.projectsList);
          this.getnonBillableProjectsList();

        },
        error => {
        });
  }

  getnonBillableProjectsList(){ 
    this.nonBillableProjectsList = this.projectsList.filter(data=>data.billable_flag == 0);
    // console.log('billable',this.nonBillableProjectsList);
    this.getActiveStatusList()
   }

   getActiveStatusList(){ 
    this.activeProjectsList = this.nonBillableProjectsList.filter(data=>data.current_month_total_hours_worked !== 0);
    // console.log('active',this.activeProjectsList);
   }

  statusFilterChanged(e) {
    const user_id = e.target.value;
    // this.filteredPreviousUserlist = this.currentUserlist.filter(item => item.status == selectedStatus);
  }

  changeNumberOfDays(event) {
    this.days = event.target.value;
    console.log('project id', this.days);
    // this.loadGraph();
    // this.refreshChart();
    this.getAdminDashboardReport();
  }

  key:string = 'first_name';
  reverse : boolean =false;

  sorting(key){
    this.key =key;
    this.reverse = !this.reverse;
  }

  // key1:string = 'project_name';
  // reverse1 : boolean =false;

  // sorting1(key1){
  //   this.key1 =key1;
  //   this.reverse1 = !this.reverse1;
  // }

}
