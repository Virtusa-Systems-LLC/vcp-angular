import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// Api Service
import { ApiService } from '../_services/api.service';
// Alert Service
import { AlertService } from '../_services/alert.service';
// custom settings Import
import { AppSettings } from '../app.settings';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-headset',
  templateUrl: './headset.component.html',
  styleUrls: ['./headset.component.css']
})
export class HeadsetComponent implements OnInit {
  
  inventoryListStatus = true;
  buttonStatus = true;
  title: String = 'Headset Information';
  inventoryViewStatus = false;
  isSubmitted = false;
  usersList = [];
  roleInfo = [];
  statusInfo = [];
  singleUser = [];
  response: any;
  inventoryForm: FormGroup;

  constructor( private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.roleInfo = AppSettings.role;
    this.statusInfo = AppSettings.status;
    this.initUser();
    this.getUsersList();
  }

  // init user
  initUser() {
    this.buttonStatus = true;

    this.inventoryForm = this.fb.group({
      headset: ['', [Validators.required]],
      serial_number: ['', [Validators.required]],
      remarks: ['']
    });
  }

  // init Data user
  initDataUser(data) {
    this.buttonStatus = false;

    this.inventoryForm = this.fb.group({
      headset: [data.headset, [Validators.required]],
      serial_number: [data.serial_number, [Validators.required]],
      remarks : [data.remarks]
    });

  }

  get headset() { return this.inventoryForm.get('headset'); }
  get serial_number() { return this.inventoryForm.get('serial_number'); }
  get remarks() { return this.inventoryForm.get('remarks'); }


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

  showAddForm() {
    this.title = 'ASSEST DECLARATION FORM';
    this.buttonStatus = true;
    this.inventoryListStatus = false;
    this.reset();
    this.alertService.clear();
  }

  backToList() {
    this.title = 'Headset Information';
    this.inventoryListStatus = true;
    this.inventoryViewStatus = false;
  }

  showEditForm(data) {
    this.title = 'Edit Assest Declaration Form';
    this.inventoryListStatus = false;
    this.initDataUser(data);
    this.alertService.clear();
  }

  showViewForm(data) {
    this.alertService.clear();
    this.title = data.first_name + ' Information';
    this.inventoryListStatus = false;
    this.inventoryViewStatus = true;
    this.singleUser = data;
  }

  // add user
  addUser() {
    this.isSubmitted = true;
    if (!this.inventoryForm.valid) {
      return;
    }

    this._api.addUser(this.inventoryForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            // this.alertService.success(this.response.message);
            this.toastr.success(this.response.message);
            this.getUsersList();
            this.backToList();
          } else {
            // this.alertService.warn(this.response.message);
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  // Update user
  updateUser() {
    this.isSubmitted = true;
    if (!this.inventoryForm.valid) {
      return;
    }
    this._api.updateUser(this.inventoryForm.value)
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
    // this.inventoryForm.reset();
    this.initUser();
  }

}
