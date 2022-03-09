import { Component, OnInit , TemplateRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AlertService } from '../_services/alert.service';

import { ApiService } from '../_services/api.service';

import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-role',
  templateUrl: './admin-role.component.html',
  styleUrls: ['./admin-role.component.css']
})
export class AdminRoleComponent implements OnInit {

  roleForm: FormGroup;
  buttonStatus = false;
  title: String = 'List Of Roles';
  roleListStatus = true;
  roleViewStatus = false;
  response: any;
  rolesList = [];
  isSubmitted = false;
  type: boolean;
  default: false;
  modalRef: BsModalRef;
  selectedRole: any;
  roleStatus: any;
  constructor(private fb: FormBuilder,
    private alertService: AlertService,
    public _api: ApiService, private toastr: ToastrService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getRoles();
    this.initRole();
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


  initRole() {
    this.buttonStatus = true;

    this.roleForm = this.fb.group({
      role_name: ['', [Validators.required]],
    });
  }

  // init Data user
  initDataRole(data) {
    this.buttonStatus = false;

    this.roleForm = this.fb.group({
      role_id: [data.role_id],
      role_name: [data.role_name, [Validators.required]]
    });

  }

  get roleName() { return this.roleForm.get('role_name'); }

  openModal(template: TemplateRef<any> , role) {
    this.modalRef = this.modalService.show(template);
    this.selectedRole = role;
  }

  onChange(event) {
    this.roleStatus = event;
  }

  confirm() {
    this.isSubmitted = true;
    this._api.updateRoleStatus({ role_id: this.selectedRole.role_id, role_status: this.roleStatus })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getRoles();
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
    this.selectedRole = null;
    this.getRoles();
   }


  showAddForm() {
    this.title = 'Add Location';
    this.buttonStatus = true;
    this.roleListStatus = false;
    this.reset();
    this.alertService.clear();
  }

  backToList() {
    this.title = 'List Of Locations';
    this.roleListStatus = true;
    this.roleViewStatus = false;
  }

  showEditForm(data) {
    this.title = 'Edit Location';
    this.roleListStatus = false;
    this.initDataRole(data);
    this.alertService.clear();
  }

  // add location
  addRole() {
    this.isSubmitted = true;
    if (!this.roleForm.valid) {
      return;
    }
    this._api.addRole(this.roleForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);

            this.backToList();
            this.getRoles();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  // Update location
  updateRole() {
    this.isSubmitted = true;
    if (!this.roleForm.valid) {
      return;
    }
    this._api.updateRole(this.roleForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.backToList();
            this.getRoles();
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
    this.initRole();
  }


}
