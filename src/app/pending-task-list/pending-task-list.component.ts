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
  selector: 'app-pending-task-list',
  templateUrl: './pending-task-list.component.html',
  styleUrls: ['./pending-task-list.component.css']
})
export class PendingTaskListComponent implements OnInit {

  taskListStatus = true;
  taskViewStatus = false;
  title: String = 'List Of Tasks';
  buttonStatus = true;
  isSubmitted = false;
  taskForm: FormGroup;
  constructor(private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.initPendingTask();
  }

  initPendingTask() {
    this.buttonStatus = true;
    this.taskForm = this.fb.group({
    });
  }
  
  backToList() {
    this.title = 'List Of Projects';
    this.taskListStatus = true;
    this.taskViewStatus = false;
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
      this.initPendingTask();
    }
}
