import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// Api Service
import { ApiService } from '../_services/api.service';
// Alert Service
import { AlertService } from '../_services/alert.service';
// custom settings Import
import { AppSettings } from '../app.settings';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
// import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as fileSaver from 'file-saver';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

import {Router} from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { identifierModuleUrl } from '@angular/compiler';

import { MONTH } from 'ngx-bootstrap/chronos/units/constants';

// declare const ExcelJS: any;

@Component({
  selector: 'app-admin-employee-project',
  templateUrl: './admin-employee-project.component.html',
  styleUrls: ['./admin-employee-project.component.css']
})
export class AdminEmployeeProjectComponent implements OnInit {

  projectListStatus = true;
  projectemployeelistflag = true;
  fileName = ' Report.xlsx';
  buttonStatus = true;
  title: String = 'List Of Projects';
  isSubmitted = false;
  projectViewStatus = false;
  projectViewStatus1 = false;
  projectreportflag = false;
  currentprojectreportflag = false ;
  addProjectflag = false ;
  dailystatus = [];
  obj = [];
  projectsList = [];
  activeProjectsList = [];
  nonBillableProjectsList = [];
  filteredProjectStatuslist = [];
  switchedProjectsList = [];
  filteredBillableProjectlist = [];
  firstFilterAppliedList = [];
  projectsList1 = [];
  projectsList2 = [];
  currentsummarylist = [];
  currentdetaillist = [];
  projectDetailReport = [];
  projectSummaryReport = [];
  CurrentProjectSummaryReport = [];
  currentprojectDetailReport = [];
  clientsList = [];
  usersList = [];
  formData;
  statusInfo = [];
  projectInfo = [];
  singleProject = [];
  singleProject1 = [];
  userData: any;
  project_name: any;
  router:Router;
  filterFlag = false;
  clearfilterflag = false ;
  
  
  
  // create form group
  projectForm: FormGroup;
  response: any;
  modalRef: BsModalRef;
  modalRefBillableStatus: BsModalRef ;
  selectedProjects: any;
  projectStatus: any;
  billableFlag: any ;
  public cancelClicked: Boolean = false;
  constructor(
    private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    // console.log(this.userData);
  }

  ngOnInit() {
    this.filterFlag = false;
    this.initProject();
    this.getProjectsList();
    this.getUsersList();
    this.getDetailReport();
    this.getSummaryReport();
    this.getCurrentMonthSummaryReport();
    this.getCurrentMonthProjectDetailReport();
    // this.switchProjectList();


    this.statusInfo = AppSettings.projectStatus;
    this.projectInfo = AppSettings.projectType;
  }

  key:string = 'name';
  reverse : boolean =true;

  sorting(key){
    this.key =key;
    this.reverse = !this.reverse;
  }

  /*name of the excel-file which will be downloaded. */

  exporttable1(): void {
    /* table id is passed over here */
    let element = document.getElementById('summary');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.project_name + ' summary' + this.fileName);

  }

  exporttable2(): void {
    /* table id is passed over here */
    let element = document.getElementById('detail');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.project_name + ' detailed' + this.fileName);

  }

 



  // init project
  initProject() {
    this.buttonStatus = true;
    this.projectForm = this.fb.group({
      project_id: [''],
      project_name: ['', [Validators.required]],
      project_type: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      deadline: [''],
      end_date: [''],
      projectManager: ['']
    });
  }

  // init data project
  initDataProject(data) {
    this.buttonStatus = false;
    let endDate = null;
    if (data.end_date) {
      endDate = moment(data.end_date).format('YYYY-MM-DD');
    }
    this.projectForm = this.fb.group({
      project_id: [data.project_id],
      project_name: [data.project_name, [Validators.required]],
      start_date: [moment(data.start_date).format('YYYY-MM-DD'), [Validators.required]],
      end_date: [endDate],
      deadline: [data.deadline],
      project_type: [data.project_type, [Validators.required]],
      projectManager: [data.user_id]
    });
  }

  get getTitle() { return this.projectForm.get('project_name'); }
  get startDate() { return this.projectForm.get('start_date'); }
  get timesheetMode() { return this.projectForm.get('project_type'); }
  // get deadline() {return this.projectForm.get('deadline'); }

  confirm() {
    // this.modalRef.hide();
    this.buttonStatus = true;
    this._api.updateProjectStatus({ project_id: this.selectedProjects.project_id, project_status: this.projectStatus })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectsList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
    this.close();
  }

  confirmBillableStatus() {
    // this.modalRef.hide();
    this.buttonStatus = true;
    this._api.updateProjectBillableStatus({ project_id: this.selectedProjects.project_id, project_billable_flag: this.billableFlag })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectsList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
    this.closeBillableStatus();
  }

  close() {
    this.modalRef.hide();
    this.selectedProjects = null;
    this.getProjectsList();
  }

  closeBillableStatus() {
    this.modalRefBillableStatus.hide();
    this.selectedProjects = null;
    this.getProjectsList();
  }

  openModal(template1: TemplateRef<any>, project) {
    this.modalRef = this.modalService.show(template1);
    this.selectedProjects = project;
  }

  openModal1(template2: TemplateRef<any>, project) {
    this.modalRefBillableStatus = this.modalService.show(template2);
    this.selectedProjects = project;
  }

  onChange(event) {
    this.projectStatus = event;
  }

  onChange1(event) {
    // this.userStatus = event;
    this.billableFlag = event ;
  }

  deleteProject() {
    this._api.deleteProject({ project_id: this.selectedProjects.project_id })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectsList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
    this.close();
  }
  cancel() {
    this.selectedProjects = null;
    this.modalRef.hide();
  }
  showAddForm() {
    this.title = 'Add Project';
    this.buttonStatus = true;
    this.projectListStatus = false;
    this.addProjectflag = true;
    this.reset();
    this.alertService.clear();
  }

  backToList() {
    this.title = 'List Of Projects';
    this.projectListStatus = true;
    this.projectViewStatus = false;
    this.projectViewStatus1 = false;
    this.projectreportflag = false;
    this.addProjectflag = false;

   
    // this.emptyListsOnPressingBackButton();// we should make to empty because when we hit back button data should be removed, else duplicates adds in tables
  }

  showEditForm(data) {
    this.title = 'Edit Project';
    this.projectListStatus = false;
    this.currentprojectreportflag = false;
    this.initDataProject(data);
    this.alertService.clear();
  }





 

  showViewForm(data) {
    this.alertService.clear();
    this.title = data.project_name + ' Project';
    this.projectListStatus = false;
    this.projectViewStatus = true;
    this.projectViewStatus1 = false;
    this.singleProject = data;
    this.project_name = data.project_name;
    this.applyingFilter(data.project_id);

    // console.log(data);
  }

  showViewEmployees(data) {
    this.projectemployeelistflag = true;
    this.singleProject = data;
    this.project_name = data.project_name;
    this.applyingFilter(data.project_id);

    // console.log(data);
  }

  showViewForm1(data) {
    this.alertService.clear();
    this.title = data.project_name + ' Project';
    this.projectListStatus = false;
    this.projectViewStatus = false;
    this.projectViewStatus1 = true;
    this.singleProject = data;
    this.project_name = data.project_name;
    this.applyingFilter(data.project_id);

    console.log(data);
  }

  showDetailForm(data) {
    this.alertService.clear();
    this.projectListStatus = false;
    this.projectViewStatus1 = false;
    this.projectViewStatus = true;
    this.singleProject1 = data;
  }

  showDetailForm1(data) {
    this.alertService.clear();
    this.projectListStatus = false;
    this.projectViewStatus = false;
    this.projectViewStatus1 = true;
    this.singleProject1 = data;
  }





  getnonBillableProjectsList(){ 
    this.nonBillableProjectsList = this.projectsList.filter(data=>data.billable_flag == 0);
    // console.log('billable',this.nonBillableProjectsList);
    this.getActiveStatusList()
   }

   getActiveStatusList(){ 
    this.activeProjectsList = this.nonBillableProjectsList.filter(data=>data.status == 1);
    // console.log('active',this.activeProjectsList);
    // this.switchProjectList();
   }


   
   
  statusFilterChanged(e) {
    // const checkedStatus = e.target.checked;
    const selectedStatus = e.target.value;

    this.filteredProjectStatuslist = this.projectsList.filter(item => item.status == selectedStatus);
    // for(let selectedStatus in status){
    // this.filteredProjectStatuslist.status.push(selectedStatus);}
    // this.filteredProjectStatuslist.push(((filteredProjectStatuslist) => filteredProjectStatuslist.status == selectedStatus));
    this.firstFilterAppliedList = this.filteredProjectStatuslist ; 
    console.log('selectedstatus', this.firstFilterAppliedList)
  }

  billableFilterChanged(e2) {
    const selectedBillableFlag = e2.target.value;
    console.log('selectedFlag', this.firstFilterAppliedList)
    this.filteredProjectStatuslist = this.firstFilterAppliedList.filter(item => item.billable_flag == selectedBillableFlag);
    // this.filteredProjectStatuslist.push(((filteredProjectStatuslist) => filteredProjectStatuslist.billable_flag == selectedBillableFlag));
    // this.filteredProjectStatuslist.push;
    // this.fil
}

clearCurrentmonthFilter(){
  document.getElementById('filters').innerHTML=null; 
  document.getElementById('filters1').innerHTML=null; 
  // document.getElementById('btn').onclick = () => {
  //   this.dropDownListObject.value = null;

  return this.getProjectsList();
}


  applyingFilter(projectid) {
    // using filter, we are extracting projects based on project id.

    this.projectDetailReport = this.projectsList1.filter(e =>
      e.project_id === projectid
    );

    this.projectSummaryReport = this.projectsList2.filter(e =>
      e.project_id === projectid
    );

    this.CurrentProjectSummaryReport = this.currentsummarylist.filter(e =>
      e.project_id === projectid
    );

    this.currentprojectDetailReport = this.currentdetaillist.filter(e =>
      e.project_id === projectid
    );

// console.log('reports',this.currentdetaillist);

  }
  // reset form
  reset() {
    this.isSubmitted = false;
    // this.projectForm.reset();
    this.initProject();
  }

  // list of projects
  getProjectsList() {
    this._api.projectsList()
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data;
          this.filteredProjectStatuslist = this.response.data;
          console.log('original data',this.filteredProjectStatuslist)
          this.getnonBillableProjectsList();
          // this.switchProjectList();
        },
        error => {
        });
  }

  getDetailReport() {
    this._api.getDetailReport()
      .subscribe(
        data => {
          this.response = data;
          this.projectsList1 = this.response.data;

          // console.log(data);
        },
        error => {
        });
  }

  getSummaryReport() {
    this._api.getSummaryReport()
      .subscribe(
        data => {
          this.response = data;
          this.projectsList2 = this.response.data;
          // this.projectsList2 = this.response;

        },
        error => {
        });
  }

  getCurrentMonthSummaryReport() {
    this._api.CurrentProjectSummaryReport()
      .subscribe(
        data => {
          this.response = data;
          this.currentsummarylist = this.response.data;
          // this.projectsList2 = this.response;

        },
        error => {
        });
  }

  getCurrentMonthProjectDetailReport() {
    this._api.CurrentProjectDetailReport()
      .subscribe(
        data => {
          this.response = data;
          this.currentdetaillist = this.response.data;
          // this.projectsList2 = this.response;

        },
        error => {
        });
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

  setFilterFlag(){
    this.filterFlag = true
    console.log('filterFlag', this.filterFlag)
    this.switchedProjectsList = this.filteredProjectStatuslist;
    }

  // switchProjectList(){
  //   console.log('flagger', this.filterFlag)
  //        this.switchedProjectsList = this.projectsList.filter(data=>data.billable_flag == 0 && data.status == 1);
    // if(this.filterFlag = true)
  //  else {
      // this.switchedProjectsList = this.filteredProjectStatuslist;
      // this.getProjectsList();
    // }
    // console.log('log log log',this.switchedProjectsList)
    // this.getProjectsList()
    // console.log('logon',this.activeProjectsList)
  // }

  handleFileInput(files: FileList) {
    this.projectForm.controls['attachment'].setValue(files.item(0));
  }

  // add project
  addProject() {
    this.isSubmitted = true;

    if (!this.projectForm.valid) {
      return;
    }
    this.projectForm.controls['start_date'].setValue(moment(this.projectForm.controls['start_date'].value).format('YYYY-MM-DD'));
    if (this.projectForm.controls['end_date'].value) {
      this.projectForm.controls['end_date'].setValue(moment(this.projectForm.controls['end_date'].value).format('YYYY-MM-DD'));
    }
    this._api.addProject(this.projectForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectsList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  // update project
  updateProject() {
    this.isSubmitted = true;
    if (!this.projectForm.valid) {
      return;
    }
    this.projectForm.controls['start_date'].setValue(moment(this.projectForm.controls['start_date'].value).format('YYYY-MM-DD'));
    if (this.projectForm.controls['end_date'].value) {
      this.projectForm.controls['end_date'].setValue(moment(this.projectForm.controls['end_date'].value).format('YYYY-MM-DD'));
    }

    this._api.updateProject(this.projectForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectsList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }



  showProjectReports() {
    this.projectreportflag = true;
    this.projectViewStatus = false;
    this.projectListStatus = false;
    this.title = 'All Projects Total working Hours report: ';
    this.buttonStatus = true;
    
    this.reset();

 
    this.alertService.clear();

  }

  showCurrentProjectReports() {
    this.currentprojectreportflag = true;
    this.projectreportflag = false;
    this.projectViewStatus = false;
    this.projectListStatus = false;
    this.buttonStatus = true;
    
    
    // this.reset();

 
    // this.alertService.clear();

  }






  
   

}