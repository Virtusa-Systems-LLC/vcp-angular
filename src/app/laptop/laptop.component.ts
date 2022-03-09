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
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.css']
})
export class LaptopComponent implements OnInit {

  inventoryListStatus = true;
  buttonStatus = true;
  title: String = 'Laptop Information';
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
      user_id: [''],
      laptop_name: ['', [Validators.required]],
      serial_num: ['', [Validators.required]],
      mac_address: ['', [Validators.required]],
      comapny_laptop: ['', [Validators.required]],
      year: ['', [Validators.required]],
      antivirus: ['', [Validators.required]],
      screen_size: ['', [Validators.required]],
      cpu_cores_count: ['', [Validators.required]],
      cpu_speed: ['', [Validators.required]],
      model: ['', [Validators.required]],
      laptop: ['', [Validators.required]],
      c_driver: ['', [Validators.required]],
      d_driver: ['', [Validators.required]],
      e_driver: ['', [Validators.required]],
      windows_pro_key: ['', [Validators.required]],
      user_name: ['', [Validators.required]],
      admin_password: ['', [Validators.required]],
      ram_size: ['', [Validators.required]],
      remarks: [''],
    });
  }

  // init Data user
  initDataUser(data) {
    this.buttonStatus = false;

    this.inventoryForm = this.fb.group({
      user_id: [data.user_id],
      laptop_name: [data.laptop_name, [Validators.required]],
      serial_num: [data.serial_num, [Validators.required]],
      mac_address: [data.mac_address, [Validators.required]],
      laptop: [data.laptop, [Validators.required]],
      ram_size: [data.ram_size, [Validators.required]],
      comapny_laptop: [data.comapny_laptop, [Validators.required]],
      year: [data.year, [Validators.required]],
      antivirus: [data.antivirus, [Validators.required]],
      screen_size: [data.screen_size, [Validators.required]],
      cpu_cores_count: [data.cpu_cores_count, [Validators.required]],
      cpu_speed: [data.cpu_speed, [Validators.required]],
      model: [data.model, [Validators.required]],
      c_driver: [data.c_driver, [Validators.required]],
      d_driver: [data.d_driver, [Validators.required]],
      e_driver: [data.e_driver, [Validators.required]],
      windows_pro_key: [data.windows_pro_key, [Validators.required]],
      user_name: [data.user_name, [Validators.required]],
      admin_password: [data.admin_password, [Validators.required]],
      remarks : [data.remarks],
    });

  }

  get laptop_name() { return this.inventoryForm.get('laptop_name'); }
  get serial_num() { return this.inventoryForm.get('serial_num'); }
  get laptop() { return this.inventoryForm.get('laptop'); }
  get ram_size() { return this.inventoryForm.get('ram_size'); }
  get remarks() { return this.inventoryForm.get('remarks'); }
  get mac_address() { return this.inventoryForm.get('mac_address'); }
  get comapny_laptop() { return this.inventoryForm.get('comapny_laptop'); }
  get year() { return this.inventoryForm.get('year'); }
  get antivirus() { return this.inventoryForm.get('antivirus'); }
  get screen_size() { return this.inventoryForm.get('screen_size'); }
  get cpu_cores_count() { return this.inventoryForm.get('cpu_cores_count'); }
  get cpu_speed() { return this.inventoryForm.get('cpu_speed'); }
  get model() { return this.inventoryForm.get('model'); }
  get c_driver() { return this.inventoryForm.get('c_driver'); }
  get d_driver() { return this.inventoryForm.get('d_driver'); }
  get e_driver() { return this.inventoryForm.get('e_driver'); }
  get windows_pro_key() { return this.inventoryForm.get('windows_pro_key'); }
  get user_name() { return this.inventoryForm.get('user_name'); }
  get admin_password() { return this.inventoryForm.get('admin_password'); }


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
    this.title = 'Laptop Information';
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
