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

@Component({
  selector: 'app-admin-locations',
  templateUrl: './admin-locations.component.html',
  styleUrls: ['./admin-locations.component.css']
})
export class AdminLocationsComponent implements OnInit {

  locationsListStatus = true;
  buttonStatus = true;
  title: String = 'List Of Locations';
  locationViewStatus = false;
  isSubmitted = false;
  locationsList = [];
  locationInfo = [];
  statusInfo = [];
  singleUser = [];
  response: any;
  locationForm: FormGroup;
  modalRef: BsModalRef;
  count = 0;
  change = false;
  valueChange = false;
  status = 1;
  selectedLocation: any;
  locationStatus: any;
  constructor(private fb: FormBuilder,
    public _api: ApiService, private toastr: ToastrService,
    private alertService: AlertService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getLocations();
    this.initLocation();
  }

  // init user
  initLocation() {
    this.buttonStatus = true;

    this.locationForm = this.fb.group({
      location_name: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  // init Data user
  initDataLocation(data) {
    this.buttonStatus = false;

    this.locationForm = this.fb.group({
      location_id: [data.location_id],
      location_name: [data.location_name, [Validators.required]],
      country: [data.country, [Validators.required]]
    });

  }
  get locationName() { return this.locationForm.get('location_name'); }
  get Country() { return this.locationForm.get('country'); }

  confirm() {
    // this.modalRef.hide();
    this.buttonStatus = true;
    this._api.updateLocationStatus({ location_id: this.selectedLocation.location_id, location_status: this.locationStatus })
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getLocations();
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
    this.selectedLocation = null;
    this.getLocations();
  }
  openModal(template: TemplateRef<any>, location) {
    this.modalRef = this.modalService.show(template);
    this.selectedLocation = location;
  }

  onChange(event) {
    this.locationStatus = event;
  }

  showAddForm() {
    this.title = 'Add Location';
    this.buttonStatus = true;
    this.locationsListStatus = false;
    this.reset();
    this.alertService.clear();
  }

  backToList() {
    this.title = 'List Of Locations';
    this.locationsListStatus = true;
    this.locationViewStatus = false;
  }

  showEditForm(data) {
    this.title = 'Edit Location';
    this.locationsListStatus = false;
    this.initDataLocation(data);
    this.alertService.clear();
  }

  // get location
  getLocations() {
    this._api.getLocations()
      .subscribe(
        data => {
          this.response = data;
          this.locationsList = this.response.data;
        },
        error => {
        });
  }

  // add location
  addLocation() {
    this.isSubmitted = true;
    if (!this.locationForm.valid) {
      return;
    }
    this._api.addLocation(this.locationForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.backToList();
            this.getLocations();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  // Update location
  updateLocation() {
    this.isSubmitted = true;
    if (!this.locationForm.valid) {
      return;
    }
    this._api.updateLocation(this.locationForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.backToList();
            this.getLocations();
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
    this.initLocation();
  }


}
