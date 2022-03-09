
import { Component, OnInit , TemplateRef, ViewChild } from '@angular/core';
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
  selector: 'app-admin-employee-users',
  templateUrl: './admin-employee-users.component.html',
  styleUrls: ['./admin-employee-users.component.css']
})
export class AdminEmployeeUsersComponent implements OnInit {

  usersListStatus = true;
  status : number;
  first_name : string ;
  buttonStatus = true;
  fileName = 'Time entry delay Report.xlsx';
  title: String = 'List Of Users';
  userViewStatus = false;
  userReportflag = false;
  userReportflag1 = false;
  isSubmitted = false;
  usersList = [];
  currentUserlist=[];
  filteredPreviousUserlist = [];
  filteredCurrentUserlist = [];
  adminDashboardlist: any;
  adminDashboardDelaylist: any ;
  usersList2=[];
  roleInfo = [];
  rolesList = [];
  statusInfo = [];
  singleUser = [];
  response: any;
  days : any ;
  searchText: any;
  selectedUser: any;
  emailPattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  userStatus: any;
  userTimeEntry : any ;
  displayedColumns: string[] = ['user_id','first_name','last_name'];

  // create form group
  userForm: FormGroup;
  modalRef: BsModalRef;
  modalRefDailyTimeentry:BsModalRef;
  userStartDate: any;
  userEndDate: IMyDate = { year: 0, month: 0, day: 0 };

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
  };

  constructor(
    private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) { } 



  ngOnInit() {
    this.roleInfo = AppSettings.role;
    this.statusInfo = AppSettings.status;
    this.initUser();
    this.getUsersList();
    this.getRoles();
    this.getUserReportPreviousMonth();
    this.getUserReportCurrentMonth();
    this.getAdminDashboardDelayReport();
  }

  // init user
  initUser() {
    this.buttonStatus = true;

    this.userForm = this.fb.group({
      user_id: [''],
      first_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      role: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: [''],
    });
  }

  statusFilterChanged(e) {
    const selectedStatus = e.target.value;
    this.filteredPreviousUserlist = this.currentUserlist.filter(item => item.status == selectedStatus);
  }
  statusFilterChanged1(e1) {
    const selectedStatus1 = e1.target.value;
    this.filteredCurrentUserlist = this.usersList2.filter(item1 => item1.status == selectedStatus1);
  }
  delayFilterChanged(e2) {  
    const selectedDelay = e2.target.value;
    this.filteredCurrentUserlist = this.usersList2.filter(item1 => item1.Daily_Time_entry_required == selectedDelay) ;
  // console.log('aaaal', this.filteredUsers3)
  }


  clearPreviousmonthFilter(){
    return this.getUserReportPreviousMonth()
  }

  clearCurrentmonthFilter(){
    return this.getUserReportCurrentMonth()
  }


  

//    showAll(){
//     var $rows = $('#findings tr');
//   $rows.show();
// }

//  showAll(){
//   var $rows = $('#userdetailscurrent tr');
// $rows.show();
// }

//  buttonClearFilter = $('#clearFilter');
// buttonClearFilter.click(showaAll);


  // init Data user
  initDataUser(data) {
    this.buttonStatus = false;
    let endDate = null;
    if (data.end_date) {
      endDate = moment(data.end_date).format('YYYY-MM-DD');
    }

    this.userForm = this.fb.group({
      user_id: [data.user_id],
      first_name: [data.first_name, [Validators.required]],
      email: [data.email, [Validators.required, Validators.pattern(this.emailPattern)]],
      role: [data.role, [Validators.required]],
      start_date: [moment(data.start_date).format('YYYY-MM-DD'), [Validators.required]],
      end_date: [endDate],
    });

  }

  get firstName() { return this.userForm.get('first_name'); }
  get email() { return this.userForm.get('email'); }
  get role() { return this.userForm.get('role'); }
  get startDate() { return this.userForm.get('start_date'); }

  doTheSearch($event: Event) {
    const stringEmitted = ($event.target as HTMLInputElement).value;
    // Your request...
  }

  // list of users
  getUsersList() {
    this._api.usersList()
      .subscribe(
        data => {
          this.response = data;
          this.usersList = this.response.data;
        },
        error => {
        });
  }

  getRoles() {
    this._api.getRoles()
      .subscribe(
        data => {
          this.response = data;
          this.rolesList = this.response.data;
        },
        error => {
        });
  }

  getUserReportPreviousMonth() {
    this._api.getUserReport()
      .subscribe(
        data => {
          this.response = data;
          this.currentUserlist = this.response.data;
          this.filteredPreviousUserlist = this.response.data;
          // console.log(data);     

        },
        error => {
        });
  }


  getUserReportCurrentMonth() {
    this._api.getUserReportCurrentMonth()
      .subscribe(
        data => {
          this.response = data;
          this.usersList2 = this.response.data;
          this.filteredCurrentUserlist = this.response.data;

          // console.log(data);
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

  changeNumberOfDays(event) {
    this.days = event.target.value;
    console.log('project id', this.days);
    // this.loadGraph();
    // this.refreshChart();
    this.getAdminDashboardReport();
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

  showAddForm() {
    this.title = 'Add User';
    this.buttonStatus = true;
    this.usersListStatus = false;
    this.userReportflag1 = false;
    this.reset();
    this.alertService.clear();
  }

  backToList() {
    this.title = 'List Of Users';
    this.usersListStatus = true;
    this.userViewStatus = false;
  }

  showEditForm(data) {
    this.title = 'Edit User';
    this.usersListStatus = false;
    this.initDataUser(data);
    this.alertService.clear();
  }

  showViewForm(data) {
    this.alertService.clear();
    this.title = data.first_name + ' Information';
    this.usersListStatus = false;
    this.userViewStatus = true;
    this.singleUser = data;
  }

  showPreviousUserReports(){
    this.userReportflag =true;
    this.userReportflag1 = false;
    this.userViewStatus = false;
    this.usersListStatus = false;
    this.title = 'User report summary';
    // this.buttonStatus = true;
    this.reset();
    this.alertService.clear();
  }

  showCurrentUserReports(){
    this.userReportflag1 =true;
    this.userReportflag = false;
    this.userViewStatus = false;
    this.usersListStatus = false;
    this.title = 'User report summary';
    // this.buttonStatus = true;
    this.reset();
    this.alertService.clear();
  }

  key:string = 'first_name';
  reverse : boolean =false;

  sorting(key){
    this.key =key;
    this.reverse = !this.reverse;
  }

  sorting1(key){
    this.key =key;
    this.reverse = !this.reverse;
  }
  
  exportdelaytable(): void {
    /* table id is passed over here */
    let element = document.getElementById('userdetails');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb,this.fileName);

  }

  exportdelaytable2(): void {
    /* table id is passed over here */
    let element = document.getElementById('userdetailscurrent');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb,this.fileName);

  }

  openModal(template: TemplateRef<any> , user) {
    this.modalRef = this.modalService.show(template);
    this.selectedUser = user;
  }

  openModal1(template1: TemplateRef<any> , user) {
    this.modalRefDailyTimeentry = this.modalService.show(template1);
    this.selectedUser = user;
    console.log(user);
  }

  onChange(event) {
    this.userStatus = event;
    // this.userTimeEntry = event ;

  }
  
  onChange1(event) {
    // this.userStatus = event;
    this.userTimeEntry = event ;
  }



  updateDailyTimeEntry(){
    this.isSubmitted = true;
    this._api.updateDailyTimeEntryStatus({ user_id: this.selectedUser.user_id, Daily_Time_entry_required : this.userTimeEntry  })
    .subscribe(
      data => {
        this.response = data;
        if (this.response.success) {
          this.toastr.success(this.response.message);
          this.getUsersList();
        } else {
          this.toastr.error(this.response.message);
        }
      },
      error => {
      });
      this.closeTimeEntry();


  }

  confirm() {
    this.isSubmitted = true;
    this._api.updateUserStatus({ user_id: this.selectedUser.user_id, user_status: this.userStatus, Daily_Time_entry_required : this.userTimeEntry  })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getUsersList();
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
    this.getUsersList();
   }

   closeTimeEntry(){
     this.modalRefDailyTimeentry.hide();
     this.selectedUser = null;
     this.getUsersList();
   }

  // add user
  addUser() {
    this.isSubmitted = true;
    if (!this.userForm.valid) {
      return;
    }

    this.userForm.controls['start_date'].setValue(moment(this.userForm.controls['start_date'].value).format('YYYY-MM-DD'));

    if (this.userForm.controls['end_date'].value) {
      this.userForm.controls['end_date'].setValue(moment(this.userForm.controls['end_date'].value).format('YYYY-MM-DD'));
    }

    this._api.addUser(this.userForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getUsersList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }


  // Update user
  updateUser() {
    this.isSubmitted = true;
    if (!this.userForm.valid) {
      return;
    }
    this.userForm.controls['start_date'].setValue(moment(this.userForm.controls['start_date'].value).format('YYYY-MM-DD'));

    if (this.userForm.controls['end_date'].value) {
      this.userForm.controls['end_date'].setValue(moment(this.userForm.controls['end_date'].value).format('YYYY-MM-DD'));
    }

    this._api.updateUser(this.userForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getUsersList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  // reset form
  reset() {
    this.isSubmitted = false;
    this.initUser();
  }

}
