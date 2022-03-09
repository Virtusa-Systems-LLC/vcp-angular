import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// Api Service
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.service';
// Alert Service
import { AlertService } from '../_services/alert.service';
// custom settings Import
import { AppSettings } from '../app.settings';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() change;
  @Output() onProfileClick = new EventEmitter();

  isSubmitted = false;
  isSubmitted1 = false;
  userData: any;
  roleInfo = [];
  statusInfo = [];
  fileName = '';
  response: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageFile: any = '';

  // create form group
  passwordForm: FormGroup;
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private domSanitizer: DomSanitizer, public _auth: AuthService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    this.roleInfo = AppSettings.role;
    this.statusInfo = AppSettings.status;
    this.initPassword();
    this.initUser(JSON.parse(localStorage.getItem('ypointPortalData')));
    this.getUserProfile();
  }

  initPassword() {
    this.passwordForm = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // init user
  initUser(data) {
    this.profileForm = this.fb.group({
      // user_id: [{ value: this.userData.user_id, disabled: true }, [Validators.required]],
      first_name: [data.first_name, [Validators.required]],
      last_name: [data.last_name, [Validators.required]],
      blood_group: [data.blood_group ? data.blood_group : '', [Validators.required]],
      phone_number: [data.phone_number, [Validators.required]],
      phone_father: [data.phone_father, [Validators.required]],
      phone_mother: [data.phone_mother, [Validators.required]],
      phone_brother: [data.phone_brother, [Validators.required]],
      phone_sister: [data.phone_sister, [Validators.required]],
      address : [data.address, [Validators.required]],
      dob: [data.dob ? moment(data.dob).format('YYYY-MM-DD') : '', [Validators.required]]
    });
  }

  get userId() { return this.profileForm.get('user_id'); }
  get firstName() { return this.profileForm.get('first_name'); }
  get phoneNumber() { return this.profileForm.get('phone_number'); }
  get phoneFather() { return this.profileForm.get('phone_father'); }
  get phoneMother() { return this.profileForm.get('phone_mother'); }
  get phoneBrother() { return this.profileForm.get('phone_brother'); }
  get phoneSister() { return this.profileForm.get('phone_sister'); }
  get lastName() { return this.profileForm.get('last_name'); }
  get bloodGroup() { return this.profileForm.get('blood_group'); }
  get birthDate() { return this.profileForm.get('dob'); }
  get Address() { return this.profileForm.get('address'); }

  get currentPassword() { return this.passwordForm.get('current_password'); }
  get newPassword() { return this.passwordForm.get('new_password'); }
  get confirmPassword() { return this.passwordForm.get('confirm_password'); }

  // get user details
  getUserProfile() {
    this._api.getUserById({})
      .subscribe(
        data => {
          this.response = data;
          this._auth.setCurrentUserProfileInfo(this.response.data);
          this.userData = this.response.data;
          this.initUser(this.userData);
          this.change = new Date().getTime();
        },
        error => {
        });
  }

  // base64 to file
  urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }


  // update Profile
  updateProfile() {
    this.isSubmitted = true;
    if (!this.profileForm.valid) {
      return;
    }

    this._api.updateProfile(this.profileForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getUserProfile();
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  // update Password
  updatePassword() {
    this.isSubmitted1 = true;
    if (!this.passwordForm.valid) {
      return;
    }
    if (this.passwordForm.controls['new_password'].value === this.passwordForm.controls['confirm_password'].value) {
      this._api.updatePassword(this.passwordForm.value)
        .subscribe(
          data => {
            this.response = data;
            if (this.response.success) {
              this.toastr.success(this.response.message);
              this.resetPassword();
            } else {
              this.toastr.error(this.response.message);
            }
          },
          error => {
          });
    } else {
      this.toastr.error('Incorrect New Password and Confirm Password');
    }

  }

  updatePicture() {
    if (!this.croppedImage) {
      this.toastr.error('Please select profile picture then upload');
    } else {

      const file = this.urltoFile(this.croppedImage, this.croppedImageFile.name, this.croppedImageFile.type);
      file.then(result => {
        const formData: FormData = new FormData();
        formData.append('file', result);

        this._api.updateProfilePicture(formData)
          .subscribe(
            data => {
              this.response = data;
              if (this.response.success) {
                this.toastr.success(this.response.message);
                this.profilePic();
                this.getUserProfile();
              } else {
                this.toastr.error(this.response.message);
              }
            },
            error => {
            });
      });
    }

  }

  // reset form
  resetProfile() {
    this.isSubmitted = false;
    // this.profileForm.reset();
  }

  // reset password
  resetPassword() {
    this.isSubmitted1 = false;
    this.passwordForm.reset();
  }

  // profile Picture
  profilePic() {
    this.croppedImage = '';
    this.imageChangedEvent = '';
    this.fileName = '';
  }

  fileChangeEvent(event: any): void {
    this.croppedImage = '';
    this.fileName = event.target.value;
    this.imageChangedEvent = event;
    this.croppedImageFile = event.target.files[0];
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
}
