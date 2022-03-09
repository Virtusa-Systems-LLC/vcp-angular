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
  selector: 'app-current-month-project',
  templateUrl: './current-month-project.component.html',
  styleUrls: ['./current-month-project.component.css']
})
export class CurrentMonthProjectReport implements OnInit {

  projectListStatus = true;
  fileName = ' Report.xlsx';
  buttonStatus = true;
  title: String = 'List Of Projects';
  isSubmitted = false;
  projectViewStatus1 = true;
  projectreportflag = false;
  currentprojectreportflag = true;
  dailystatus = [];
  obj = [];
  projectsList = [];
  projectsList1 = [];
  projectsList2 = [];
  currentsummarylist = [];
  currentdetaillist = [];
  projectDetailReport = [];
  projectSummaryReport = [];
  currentprojectSummaryReport = [];
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
  router:Router
  
  
  // create form group
  projectForm: FormGroup;
  response: any;
  modalRef: BsModalRef;
  selectedProjects: any;
  projectStatus: any;
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
    this.initProject();
    this.getProjectsList();
    this.getUsersList();
    this.getCurrentMonthSummaryReport();
    this.getCurrentMonthProjectDetailReport();
    // this.getNonCompliantReportPreviousMonth();
    // this.getNonCompliantReportCurrentMonth();

    this.statusInfo = AppSettings.projectStatus;
    this.projectInfo = AppSettings.projectType;
  }




// emptyListsOnPressingBackButton(){
//   this.currentmonthTotalProjectReportListEmployee = []; 
//   this.previousmonthTotalProjectReportListEmployee = [];

//   this.overallWorkdonePreviousMonthListProject = []; 
//   this.overallWorkdoneCurrentMonthListProject = []
// }

  

  csvoptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Report',
    useBom: true,
    noDownload: true,
    headers: ["user_id", "first_name", "last_name", "project_id", "date", "hours", "last24hours"],
  };

  // dailystatusreport(){
  //   let data = [];
  //   __.each(this.dailystatus, (Obj) =>{
  //     data.push({
  //       'first_name' : this.obj['first_name'],
  //       'last_name' : this.obj['last_name'],
  //       'project_name' : this.obj['project_name'],
  //     });
  //   });
  //   new AngularCsv(data, 'My Report', this.csvoptions);
  // }


  // exportexcel(): void {
  //   this._api.getDailyStatus().subscribe(
  //     ({ data }) => {
  //       console.log(data);

  //       const workbook = new ExcelJS.Workbook();
  //       const sheet = workbook.addWorksheet('Daily Status');

  //       sheet.columns = [
  //         { header: 'Sl No.', key: 'no', width: 10 },
  //         { header: 'User Id', key: 'id', width: 15 },
  //         { header: 'project_id', key: 'project_id', width: 15 },
  //         { header: 'date', key: 'date', width: 10 },
  //         { header: 'Work done', key: 'last24', width: 25 },
  //         { header: 'hours', key: 'hours', width: 10 },
  //         { header: 'created_date', key: 'created_date', width: 10 }

  //       ];

  //       data.forEach(record => {
  //         sheet.addRow({ 'no': record.id, 'id': record.user_id, 'project_id': record.project_id, 'date': record.date, 'last24': record.last24hours, 'hours': record.hours, 'created_date': record.created_date })
  //       })
  //       workbook.xlsx.writeBuffer().then((data) => {
  //         const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  //         fileSaver.saveAs(blob, 'DailyStatusReport.xlsx')
  //       })
  //     }
  //   )



  // }

  key:string = 'hoursworked';
  reverse : boolean =false;

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

  close() {
    this.modalRef.hide();
    this.selectedProjects = null;
    this.getProjectsList();
  }
  openModal(template: TemplateRef<any>, project) {
    this.modalRef = this.modalService.show(template);
    this.selectedProjects = project;
  }

  onChange(event) {
    this.projectStatus = event;
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
    this.reset();
    this.alertService.clear();
  }

  backToList() {
    this.title = 'List Of Projects';
    this.projectListStatus = true;
    this.projectViewStatus1 = false;
    this.projectreportflag = false;
   
    // this.emptyListsOnPressingBackButton();// we should make to empty because when we hit back button data should be removed, else duplicates adds in tables
  }

  showEditForm(data) {
    this.title = 'Edit Project';
    this.projectListStatus = false;
    this.initDataProject(data);
    this.alertService.clear();
  }





 

  showViewForm1(data) {
    this.alertService.clear();
    this.title = data.project_name + ' Project';
    this.projectListStatus = false;
    this.projectViewStatus1 = true;
    this.singleProject = data;
    this.project_name = data.project_name;
    this.applyingFilter(data.project_id);

    console.log(data);
  }


  showDetailForm(data) {
    this.alertService.clear();
    this.projectListStatus = false;
    this.projectViewStatus1 = true;
    this.singleProject1 = data;



  }


  applyingFilter(projectid) {
    // using filter, we are extracting projects based on project id.

    // this.projectDetailReport = this.projectsList1.filter(e =>
    //   e.project_id === projectid
    // );

    // this.projectSummaryReport = this.projectsList2.filter(e =>
    //   e.project_id === projectid
    // );

    this.currentprojectSummaryReport = this.currentsummarylist.filter(e =>
      e.project_id === projectid
    );

    this.currentprojectDetailReport = this.currentdetaillist.filter(e =>
      e.project_id === projectid
    );

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
          console.log('detail', this.currentdetaillist)
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



  // showCurrentProjectReports() {
  //   this.projectreportflag = false;
  //   this.currentprojectreportflag = true;
  //   this.projectViewStatus1 = false;
  //   this.projectListStatus = false;
  //   // this.title = 'All Projects Total working Hours report: ';
  //   // this.buttonStatus = true;
    
  //   this.reset();

 
  //   this.alertService.clear();

  // }
}
