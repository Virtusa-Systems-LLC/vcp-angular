import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Api Service
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.service';
// Alert Service
import { AlertService } from '../_services/alert.service';
// custom settings Import
import { AppSettings } from '../app.settings';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isSubmitted = false;
  returnUrl: string;
  isLogin = true;
  title = 'Sign in';
  emailPattern: any = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  response: any;
  // create form group
  loginForm: FormGroup;
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    public _auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this._auth.clearData();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {
    this.initLogin();
    this.initResetPassword();
  }

  // init login
  initLogin() {
    this.title = 'Sign in';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      user_agent: ['WEB']
    });
  }

  // init reset password
  initResetPassword() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get resetEmail() { return this.resetForm.get('email'); }

  submitLogin() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    this._auth.loginForm(this.loginForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.router.navigate(['dashboard']);
          } else {
           this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  resetPasswordForm() {
    this.title = 'Reset Password';
    this.isLogin = false;
    this.reset();
  }

  resetPassword() {
    this.isSubmitted = true;
    if (!this.resetForm.valid) {
      return;
    }
    this._auth.resetPassword(this.resetForm.value)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
          } else {
            this.toastr.error(this.response.message);
          }
        },
        error => {
        });
  }

  loginFormBack() {
    this.title = 'Sign in';
    this.isLogin = true;
    this.reset();
  }

  // reset form
  reset() {
    this.isSubmitted = false;
    this.loginForm.reset();
    this.resetForm.reset();
  }


}
