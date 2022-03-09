import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { IDropdownSettings } from 'ng-multiselect-dropdown';
// Api Service
import { ApiService } from '../_services/api.service';
// Alert Service
import { AlertService } from '../_services/alert.service';
// custom settings Import
import { AppSettings } from '../app.settings';
import { ToastrService } from 'ngx-toastr';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import * as _ from 'underscore';
import { controllers } from 'chart.js';


@Component({
  selector: 'app-project-allocation',
  templateUrl: './project-allocation.component.html',
  styleUrls: ['./project-allocation.component.css']
})
export class ProjectAllocationComponent implements OnInit {

  projectAllocationListStatus = true;
  title: String = 'List Of Project Allocations';
  buttonStatus = true;
  isSubmitted = false;
  pickerStatus = false;
  projectsAllocationList = [];
  statusInfo = [];
  projectsList = [];
  usersList = [];
  id: any;
  name: any;
  info: any;
  projectsAllocationsList = [];
  // create form group
  projectAllocationForm: FormGroup;
  projectAllocationDatesForm: FormGroup;
  response: any;
  items: any = [];
  arr: any = [];
  arr1: any = [];
  arr2: any = [];
  arr3: any = [];
  arr4: any = [];
  selectedItems: any = [];
  modalRef: BsModalRef;
  selectedProjects: any;
  selectedProject: any;
  projectStatus: any;
  dropdownSettings: any = {};
  deSelectedUserIds = [];
  ShowFilter = false;
  startDates = [];
  endDates = [];
  constructor(
    private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {

  }

  ngOnInit() {
    this.initProjectAllocation();
    this.getUserProjectDetails();
    this.getProjectAllocationsList();
    this.initProjectAllocationDates();
    this.statusInfo = AppSettings.projectStatus;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'first_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 50,
      // allowSearchFilter: this.ShowFilter,
      allowSearchFilter: true,
      enableCheckAll: false
    };
    // this.projectAllocationForm = this.fb.group({
    //   user_id: [this.selectedItems]
    // });
  }

  onItemSelect(item: any) {
    this.deSelectedUserIds = _.without(this.deSelectedUserIds, item.user_id);
  }

  onDeSelect(item: any) {
    this.deSelectedUserIds.push(item.user_id);
  }

  initProjectAllocation() {
    this.buttonStatus = true;
    this.projectAllocationForm = this.fb.group({
      id: [''],
      project_id: ['', [Validators.required]],
      user_id: [''],
      //  deSelectedUserIds: ['']
    });
  }

  initDataProjectAllocation(data) {
    this.buttonStatus = false;
    this.arr = (data.user_names).split(',');
    this.arr1 = (data.user_ids).split(',');
    //  this.selectedItems = [{ user_id: 26, first_name: "Sri" }, { user_id: 28, first_name: "Ashok" }];
    this.arr3 = [];
    this.selectedItems = [];
    for (let i = 0; i < this.arr.length; i++) {
      const info = {
        user_id: Number(this.arr1[i]),
        first_name: this.arr[i]
      };
      this.arr3[i] = info;
    }
    for (let j = 0; j < this.arr3.length; j++) {
      this.selectedItems[j] = this.arr3[j];
    }
    this.deSelectedUserIds = [];
    this.projectAllocationForm = this.fb.group({
      id: [data.id],
      project_id: [data.projectid, [Validators.required]],
      user_id: [this.selectedItems],
      deSelectedUserIds: ['']
    });
  }

  get projectId() { return this.projectAllocationForm.get('project_id'); }
  get getUsers() { return this.projectAllocationForm.get('user_id'); }



  showAddForm() {
    this.getUserProjectDetails();
    this.title = 'Add Project Allocation';
    this.projectAllocationListStatus = false;
    this.buttonStatus = true;
    this.pickerStatus = false;
    this.reset();
  }

  backToList() {
    this.title = 'List Of ProjectAllocations';
    this.projectAllocationListStatus = true;
    this.pickerStatus = false;
  }

  // reset form
  reset() {
    this.isSubmitted = false;
    this.projectAllocationForm.reset();
  }

  showEditForm(data) {
    this.title = 'Edit Project';
    this.getUserUpdateProjectDetails(data.projectid);
    this.buttonStatus = false;
    this.projectAllocationListStatus = false;
    this.pickerStatus = false;
    this.initDataProjectAllocation(data);
    this.alertService.clear();
  }

  showPickerForm(data) {
    this.items = [];
    this.initProjectAllocationDates();
    this.isSubmitted = false;
    this.title = 'Pick Dates for employees - ' + data.project_name;
    this.projectAllocationListStatus = false;
    this.pickerStatus = true;
    this.alertService.clear();
    this.getUserProjectAllocations(data.projectid);
  }

  initProjectAllocationDates() {
    this.projectAllocationDatesForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  initDates(): FormGroup {
    return this.fb.group({
      id: '',
      start_date: '',
      end_date: '',
      title: '',
      display_name: '',
      project_id: '',
      user_id: '',
      time_limit_daily: '',
      time_limit_weekly: '',
      time_limit_yearly: ''
    });
  }


  createFormWithDefaultData(data): FormGroup {
    let endDate = '';
    let startDate = '';
    let pendDate = '';
    let pstartDate = '';
    let projectend_date = data.end_date;
    let projectstart_date = data.start_date;
    if (data.end_date) {
      endDate = moment(data.end_date).format('YYYY-MM-DD');
    }
    if (data.start_date) {
      startDate = moment(data.start_date).format('YYYY-MM-DD');
    }
    if (projectend_date) {
      pendDate = moment(projectend_date).format('YYYY, MM, DD');
    } else {
      pendDate = moment(projectend_date).format('YYYY, MM, DD');
    }
    if (projectstart_date) {
      pstartDate = moment(projectstart_date).format('YYYY, MM, DD');
    }
    return this.fb.group({
      id: data.id,
      start_date: [startDate, [Validators.required]],
      end_date: endDate,
      project_name: data.project_name,
      first_name: data.first_name,
      project_id: data.project_id,
      user_id: data.user_id,
      project_start_date: new Date(pstartDate),
      project_end_date: new Date(pendDate),
      time_limit_daily: data.time_limit_daily,
      time_limit_weekly: data.time_limit_weekly,
      time_limit_yearly: data.time_limit_yearly
    });

  }

  // get User Project Allocations
  getUserProjectAllocations(project_id) {

    const info = {
      'project_id': project_id
    };
    this._api.getUserProjectAllocations(info)
      .subscribe(
        (data) => {
          this.response = data;
          this.projectsAllocationsList = this.response.data;
          this.response.data.forEach((cust) => {
            this.items = this.projectAllocationDatesForm.get('items') as FormArray;
            this.items.push(this.createFormWithDefaultData(cust));
          });
        },
        error => {
        });
  }

  getUserProjectDetails() {
    this._api.getUserProjectDetails()
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data.projects;
          this.usersList = this.response.data.users;
        },
        error => {
        });
  }

  getUserUpdateProjectDetails(project_id) {
    const info = {
      'project_id': project_id
    };
    this._api.getUserEditProjectDetails(info)
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data.projects;
          this.usersList = this.response.data.users;
        },
        error => {
        });
  }

  // get details
  getProjectAllocationsList() {
    this._api.getProjectAllocationsList()
      .subscribe(
        data => {
          this.response = data;
          this.projectsAllocationList = this.response.data;
        },
        error => {
        });
  }

  // add Project Allocation
  addProjectAllocation() {
    this.isSubmitted = true;
    if (!this.projectAllocationForm.valid) {
      return;
    }
    this._api.addProjectAllocation(this.projectAllocationForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectAllocationsList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  confirm() {
    this.isSubmitted = true;
    this._api.deleteProjectAllocationById({ project_id: this.selectedProject.project_id })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectAllocationsList();
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
    this.selectedProject = null;
  }

  openModal(template: TemplateRef<any>, project) {
    this.modalRef = this.modalService.show(template);
    this.selectedProject = project;
  }


  // update Project Allocation
  updateProjectAllocation() {
    this.isSubmitted = true;
    if (!this.projectAllocationForm.valid) {
      return;
    }

    this.projectAllocationForm.controls['deSelectedUserIds'].setValue(this.deSelectedUserIds);
    this._api.updateProjectAllocation(this.projectAllocationForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectAllocationsList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  updateProjectAllocationDates() {
    this.isSubmitted = true;

    if (!this.projectAllocationDatesForm.valid) {
      return;
    }
    // this.projectAllocationDatesForm.controls['start_date'].setValue(moment(this.projectAllocationDatesForm.controls['start_date'].value).format('YYYY-MM-DD'));
    // if (this.projectAllocationDatesForm.controls['end_date'].value) {
    //   this.projectAllocationDatesForm.controls['end_date'].setValue(moment(this.projectAllocationDatesForm.controls['end_date'].value).format('YYYY-MM-DD'));
    // }
    this._api.updateProjectAllocationsDates(this.projectAllocationDatesForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getProjectAllocationsList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

}
