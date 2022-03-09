import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// custom settings Import
import { AppSettings } from '../app.settings';
// Api Service
import { ApiService } from '../_services/api.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../_models/profile';
import { User } from '../_models/user';

@Injectable()
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public profileInfo: BehaviorSubject<Profile>;
  constructor(private http: HttpClient, private router: Router, public _api: ApiService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('ypointPortalData')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.profileInfo = new BehaviorSubject<Profile>(null);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentUserProfileInfo(): Profile {
    return this.profileInfo.value;
  }

  public setCurrentUserProfileInfo(data: Profile) {
    this.profileInfo.next(data);
  }

  // extract data
  extractData(res: Response): any {
    return res.json() || {};
  }

  // login general form submit
  loginForm(data) {
    return this.http.post<any>(AppSettings.LOGIN_FORM_API, data)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user.success) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('ypointPortalData', JSON.stringify(user.data));
          this.currentUserSubject.next(user.data);
          
        }

        return user;
      }));
  }

  // reset Password
  resetPassword(data) {
    return this.http.post(AppSettings.RESET_PASSWORD_API, data);
  }
  // sign out
  clearData() {
    // remove user from local storage to log user out
    localStorage.removeItem('ypointPortalData');
    // Remove all saved data from localStorage
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.profileInfo.next(null);
    this.router.navigate(['login']);

  }

}
