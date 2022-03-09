import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-employee-allocations',
  templateUrl: './employee-allocations.component.html',
  styleUrls: ['./employee-allocations.component.css']
})
export class EmployeeAllocationsComponent implements OnInit {

  employeeAllocationListStatus = true;
  title: String = 'List Of Employee Allocations';
  buttonStatus = true;
  isSubmitted = false;
  pickerStatus = false;
  employeesAllocationList = [];
  statusInfo = [];
  projectsList = [];
  usersList = [];
  projectsAllocationsList = [];
  // create form group
  employeeAllocationForm: FormGroup;
  employeeAllocationDatesForm: FormGroup;
  response: any;
  items: any = [];
  modalRef: BsModalRef;
  selectedProjects: any;
  selectedProject: any;
  projectStatus: any;
  dropdownSettings: any = {};
  deSelectedUserIds = [];
  ShowFilter = false;
  arr: any = [];
  arr1: any = [];
  arr2: any = [];
  arr3: any = [];
  arr4: any = [];
  in: any;
  selectedItems: any = [];
  constructor(
    private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {

  }

  ngOnInit() {
    this.initEmployeeAllocation();
    this.getEmployeesProjectAllocationDetails();
    this.getEmployeeAllocationsList();
    this.initProjectAllocationDates();
    this.statusInfo = AppSettings.projectStatus;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'project_id',
      textField: 'project_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
     // itemsShowLimit: 50,
     // allowSearchFilter: this.ShowFilter,
      allowSearchFilter: true,
      enableCheckAll: false
    };
  }

  onItemSelect(item: any) {
    this.deSelectedUserIds = _.without(this.deSelectedUserIds, item.project_id);
  }

  onDeSelect(item: any) {
    this.deSelectedUserIds.push(item.project_id);
  }

  initEmployeeAllocation() {
    this.buttonStatus = true;
    this.employeeAllocationForm = this.fb.group({
      id: [''],
      user_id: ['', [Validators.required]],
      project_id: [''],
    //  deSelectedUserIds: ['']
    });
  }

  initDataProjectAllocation(data) {
    this.buttonStatus = false;
    this.arr = (data.project_names).split(',');
    this.arr1 = (data.project_ids).split(',');
    //  this.selectedItems = [{ user_id: 26, first_name: "Sri" }, { user_id: 28, first_name: "Ashok" }];
    this.arr3 = [];
    this.selectedItems = [];
    for (let i = 0; i < this.arr.length ; i++) {
      const info = {
        project_id: Number(this.arr1[i]),
        project_name: this.arr[i]
      };
      this.arr3[i] = info;
    }
    for (let j = 0; j < this.arr3.length; j++) {
       this.selectedItems[j] = this.arr3[j];
    }
    this.deSelectedUserIds = [];
    this.employeeAllocationForm = this.fb.group({
       id: [data.id],
       user_id: [data.userid, [Validators.required]],
       project_id: [this.selectedItems],
       deSelectedUserIds: ['']
    });
  }

  get projectId() { return this.employeeAllocationForm.get('project_id'); }
  get getUsers() { return this.employeeAllocationForm.get('user_id'); }



  showAddForm() {
    this.getEmployeesProjectAllocationDetails();
    this.title = 'Add Employee Allocation';
    this.employeeAllocationListStatus = false;
    this.buttonStatus = true;
    this.pickerStatus = false;
    this.reset();
  }

  backToList() {
    this.title = 'List Of EmployeeAllocations';
    this.employeeAllocationListStatus = true;
    this.pickerStatus = false;
  }

  // reset form
  reset() {
    this.isSubmitted = false;
    this.employeeAllocationForm.reset();
  }

  showEditForm(data) {
    this.title = 'Edit Employee Allocation';
    this.getEmployeeUpdateProjectDetails(data.userid);
    this.buttonStatus = false;
    this.employeeAllocationListStatus = false;
    this.pickerStatus = false;
    this.initDataProjectAllocation(data);
    this.alertService.clear();
  }

  showPickerForm(data) {
    this.items = [];
    this.initProjectAllocationDates();
    this.isSubmitted = false;
    this.title = 'Pick Dates for employees - ' + data.first_name;
    this.employeeAllocationListStatus = false;
    this.pickerStatus = true;
    this.alertService.clear();
    this.getEmployeeProjectAllocations(data.userid);
  }

  initProjectAllocationDates() {
    this.employeeAllocationDatesForm = this.fb.group({
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
  getEmployeeProjectAllocations(user_id) {

    const info = {
      'user_id': user_id
    };
    this._api.getEmployeeProjectAllocations(info)
      .subscribe(
        (data) => {
          this.response = data;
          this.projectsAllocationsList = this.response.data;

          this.response.data.forEach((cust) => {
            this.items = this.employeeAllocationDatesForm.get('items') as FormArray;
            this.items.push(this.createFormWithDefaultData(cust));
          });
        },
        error => {
        });
  }

  // get details
  getEmployeesProjectAllocationDetails() {
    this._api.getEmployeesProjectAllocationDetails()
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data.projects;
          this.usersList = this.response.data.users;
        },
        error => {
        });
  }

  getEmployeeUpdateProjectDetails(user_id) {
    const info = {
      'user_id': user_id
    };
    this._api.getEmployeeEditProjects(info)
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
  getEmployeeAllocationsList() {
    this._api.getEmployeeAllocationsList()
      .subscribe(
        data => {
          this.response = data;
          this.employeesAllocationList = this.response.data;
        },
        error => {
        });
  }

  // add Project Allocation
  addEmployeeAllocation() {
    this.isSubmitted = true;

    if (!this.employeeAllocationForm.valid) {
      return;
    }
    this._api.addEmployeeAllocation(this.employeeAllocationForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getEmployeeAllocationsList();
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
    this._api.deleteEmployeeAllocationById({ user_id: this.selectedProject.user_id })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getEmployeeAllocationsList();
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

  openModal(template: TemplateRef<any>, employee) {
    this.modalRef = this.modalService.show(template);
    this.selectedProject = employee;
  }



  // update Project Allocation
  updateEmployeeAllocation() {
    this.isSubmitted = true;
    if (!this.employeeAllocationForm.valid) {
      return;
    }
    this.employeeAllocationForm.controls['deSelectedUserIds'].setValue(this.deSelectedUserIds);
    this._api.updateEmployeeAllocation(this.employeeAllocationForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getEmployeeAllocationsList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  updateEmployeeAllocationDates() {
    this.isSubmitted = true;

    if (!this.employeeAllocationDatesForm.valid) {
      return;
    }
    this._api.updateEmployeeAllocationDates(this.employeeAllocationDatesForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getEmployeeAllocationsList();
            this.backToList();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

}
