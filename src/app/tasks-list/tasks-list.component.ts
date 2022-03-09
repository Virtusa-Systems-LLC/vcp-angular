import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// Api Service
import { ApiService } from '../_services/api.service';
// Alert Service
import { AlertService } from '../_services/alert.service';
// custom settings Import
import { AppSettings } from '../app.settings';
import { ToastrService } from 'ngx-toastr';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {

  taskListStatus = true;
  taskViewStatus = false;
  buttonStatus = true;
  title: String = 'List Of Tasks';
  isSubmitted = false;
  taskForm: FormGroup;
  response: any;
  approvedListStatus = true;
  modalRef: BsModalRef;
  selectedProjects: any;
  projectsList = [];
  constructor(private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.initTask();
    this.getProjectsList();
  }

  // init project
  initTask() {
    this.buttonStatus = true;
    this.taskForm = this.fb.group({
      project_id: [''],
      project_name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      first_name: [''],
      assigned_date: ['', [Validators.required]],
      completion_date: [''],
      production_deployment_date: [''],
      status: ['']
    });
  }

  // list of projects
  getProjectsList() {
    this._api.getProjectManagerProjectsList({})
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data;
        },
        error => {
        });
  }

  // init Data user
  initDataTask(data) {
    this.buttonStatus = false;

    this.taskForm = this.fb.group({
      project_id: [''],
      project_name: ['', [Validators.required]],
      description: [data.description, [Validators.required]],
      first_name: [data.first_name],
      assigned_date: [data.assigned_date, [Validators.required]],
      completion_date: [data.completion_date],
      production_deployment_date: [data.production_deployment_date],
      status: [data.status]
    });

  }

  get description() { return this.taskForm.get('description'); }
  get assigned_date() { return this.taskForm.get('assigned_date'); }
  get projectName() { return this.taskForm.get('project_name'); }

  // confirm() {
  //   // this.modalRef.hide();
  //   this.buttonStatus = true;
  //   this._api.updateProjectStatus({ project_id: this.selectedProjects.project_id, project_status: this.projectStatus })
  //     .subscribe(
  //       data => {
  //         this.response = data;
  //         if (this.response.success) {
  //           this.toastr.success(this.response.message);
  //         //  this.getProjectsList();
  //         } else {
  //           this.toastr.error(this.response.message);
  //         }
  //       },
  //       error => {
  //       });
  //   this.close();
  // }

  close() {
    this.modalRef.hide();
    this.selectedProjects = null;
    // this.getProjectsList();
  }

  openModal(template: TemplateRef<any>, project) {
    this.modalRef = this.modalService.show(template);
    this.selectedProjects = project;
  }

  onChange(event) {
   // this.projectStatus = event;
  }

  backToList() {
    this.title = 'List Of Projects';
    this.taskListStatus = true;
    this.taskViewStatus = false;
  }

  showEditForm(data) {
    this.title = 'Edit Task';
    this.taskListStatus = false;
    this.initDataTask(data);
    this.alertService.clear();
  }

  showAddForm() {
    this.title = 'Add Task';
    this.buttonStatus = true;
    this.taskListStatus = false;
    this.reset();
    this.alertService.clear();
  }

   // reset form
   reset() {
    this.isSubmitted = false;
    // this.projectForm.reset();
    this.initTask();
  }

  addTask() {
    this.isSubmitted = true;

    if (!this.taskForm.valid) {
      return;
    }
    this._api.addTaskList(this.taskForm.value)
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

}
