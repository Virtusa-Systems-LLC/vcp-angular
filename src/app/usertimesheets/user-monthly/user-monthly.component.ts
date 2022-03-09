// import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
  FormArray,
} from "@angular/forms";

import { Component, OnInit, AfterViewInit } from '@angular/core';
// Api Service
import { ApiService } from '../../_services/api.service';
// Alert Service
import { AlertService } from '../../_services/alert.service';

import { AppSettings } from "../../app.settings";

import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";

import * as moment from "moment";
import * as _ from "underscore";
import * as CryptoJS from 'crypto-js';  

@Component({
  selector: 'app-user-monthly',
  templateUrl: './user-monthly.component.html',
  styleUrls: ['./user-monthly.component.css']
})
export class UserMonthlyComponent implements OnInit {
  buttonStatus = true;
  title: String = "YPoint Monthly Status";
  isSubmitted = false;
  dailyFormStatus: Boolean = false;
  dailyViewStatus: Boolean = false;
  projectsList = [];
  timesheetData = [];
  clientsList = [];
  formData;
  statusInfo = [];
  projectInfo = [];
  singleLocation = [];
  userData: any;
  totalHours = 0;
  // create form group
  dailyStatusForm: FormGroup;
  response: any;
  dailyStatusList = [];

  dailyStatusInfo = [];
  hoursData = [];
  ModalTitle: string;
  calendarOneWeek: Date;
  calendarTwoWeek: Date;
  calendarThreeWeek: Date;

  temp: any;
  j = 0;
  daysInLastMonth: any;
  currentMonth: any;
  currentDate: any;
  weekData: any;
  selectedDateInfo: any;
  pid_status = false;
  count = 0;
  val: boolean;
  locationsList = [];
  checkincheckoutdata = [];
  usersList = [];
  next24HoursData: any;
  name1: any;
  name2: any;
  flag: boolean;
  public popoverTitle: String = "Delete Confirmation Message";
  public popoverMessage: String =
    "Please confirm.., Do you really want to delete the daily status?";
  public confirmClicked: Boolean = false;
  public cancelClicked: Boolean = false;

  /* dates from server i.e MYSQL , these are GMT format,the reason we are fetching dates from server side is users shouldn't manipulate time entry by changing desktop time* */
  today: any;
  current_month_start_date: any;
  current_month_end_date: any;
  previous_month_start_date: any;
  previous_month_end_date: any;
  next_month_start_date: any;

  ED_buttonstatus: Boolean = false; // to disable or enable EDIT status and DELETE buttons.
  numberflag: number = 0; // we are using this for different notifications pop up , during time entry locking
  constructor(
    private fb: FormBuilder,
    public _api: ApiService,
    private alertService: AlertService,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) {
    //  console.log(this.userData);
    this.getDatesForLockTimeEntry(); // fetching server side dates(GMT FORMAT) for current month , previous month start and end dates as well as today's date
  }

  ngOnInit() {
    this.dailyViewStatus = true;
    this.initProject();
    // this.getProjectsList();
    this.getDaysOfMonth();
    this.getLocations();
    this.getCheckinCkeckoutData(moment().format("YYYY-MM-DD"));
    this.getDailyStatusProjectsList(moment().format("YYYY-MM-DD"));
    this.statusInfo = AppSettings.location;
    this.projectInfo = AppSettings.projectType;
    this.currentDate = moment().format("MM/DD/YY");
    this.getDailyStatusByDate(moment().format("YYYY-MM-DD"));
    this.getUserTimeLimitData();

    this.checkButtonStatus(); // we enable or disable edit status and delete status based on below conditions.
  }

  checkButtonStatus() {
    /**  Enable: buttons are enabled from previous month start date to current month end date
     *
     *  Disable : buttons are disabled for old months,because users should no longer edit/delete their status for months before previous months.
     */
    console.log("status check....");

    let selected_date = this.datepipe.transform(this.currentDate, "yyyy-MM-dd");

    if (
      selected_date >= this.previous_month_start_date &&
      selected_date < this.next_month_start_date
    ) {
      this.ED_buttonstatus = false;
    } else {
      this.ED_buttonstatus = true;
    }
  }

  getDatesForLockTimeEntry() {
    this._api.getLockTimeEntryDates().subscribe(
      (info) => {
        this.response = info;
        // console.log(this.response);
        let dates = this.response.data[0];
        this.today = dates.today;
        this.current_month_start_date = dates.current_month_start_date;
        this.current_month_end_date = dates.current_month_end_date;
        this.previous_month_start_date = dates.previous_month_start_date;
        this.previous_month_end_date = dates.previous_month_end_date;
        this.next_month_start_date = dates.next_month_start_date;

        // console.log(this.today + "***"+this.current_month_start_date)
      },
      (error) => {}
    );
  }

  plainText:string;  
  encryptText: string;  
  encPassword: string;  
  decPassword:string;  
  conversionEncryptOutput: string;  
  conversionDecryptOutput:string;  
    
  
  
  //method is used to encrypt and decrypt the text  
  convertText(conversion:string) {  
      if (conversion=="encrypt") {  
        this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();  
      }  
      else {  
        this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);  
       
    }  
  }  



  checkIn(project_id) {
    this.isSubmitted = true;
    this._api
      .addCheckInTime({
        project_id: project_id,
        date: this.selectedDateInfo.dateFormat,
      })
      .subscribe(
        (data) => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getCheckinCkeckoutData(this.selectedDateInfo.dateFormat);
          } else {
            this.toastr.error(this.response.message);
          }
        },
        (error) => {}
      );
  }

  checkOut(project_id) {
    this.isSubmitted = true;
    const res = _.where(this.checkincheckoutdata, { project_id: project_id });
    const id = res[res.length - 1].id;
    this._api
      .updateCheckoutTime({
        id: id,
        checkin_time: res[res.length - 1].checkin_time,
      })
      .subscribe(
        (data) => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.getCheckinCkeckoutData(this.selectedDateInfo.dateFormat);
          } else {
            this.toastr.error(this.response.message);
          }
        },
        (error) => {}
      );
  }

  getCheckinCkeckoutData(selectedDate) {
    // const info = {
    //   date: moment().format('YYYY-MM-DD')
    // };
    this._api.getCheckinCkeckoutData({ date: selectedDate }).subscribe(
      (data) => {
        this.response = data;
        this.checkincheckoutdata = this.response.data;
      },
      (error) => {}
    );
  }

  getProjectWiseCheckinCheckoutData(project_id) {
    const res = _.where(this.checkincheckoutdata, { project_id: project_id });
    return res;
  }

  isCheckinDisabled(project_id) {
    const res = _.where(this.checkincheckoutdata, { project_id: project_id });
    if (res && res.length > 0 && res[res.length - 1].checkout_time == null) {
      return true;
    } else {
      return false;
    }
  }

  isCheckoutDisabled(project_id) {
    const res = _.where(this.checkincheckoutdata, { project_id: project_id });
    if (
      res &&
      (res.length === 0 ||
        (res.length > 0 &&
          (res[res.length - 1].checkin_time == null ||
            (res[res.length - 1].checkin_time != null &&
              res[res.length - 1].checkout_time != null))))
    ) {
      return true;
    } else {
      return false;
    }
  }

  getDaysOfMonth() {
    this.daysInLastMonth = [];
    this.currentMonth = moment().format("MMM, YYYY");
    const weekStart = moment().startOf("isoWeek");
    this.weekData = weekStart;
    for (let i = 0; i <= 6; i++) {
      const day1 = moment(weekStart).add(i, "days").format("DD");
      this.daysInLastMonth.push({
        day: day1,
        date: moment(weekStart).add(i, "days").format("MM/DD/YY"),
        dateFormat: moment(weekStart).add(i, "days").format("YYYY-MM-DD"),
      });
    }
    this.selectedDateInfo = {
      day: moment().format("DD"),
      date: moment().format("MM/DD/YY"),
      dateFormat: moment().format("YYYY-MM-DD"),
    };
    // return days;
  }

  nextWeek() {
    this.daysInLastMonth = [];
    this.count += 1;
    const weekStart = moment(this.weekData).add(1, "weeks").startOf("isoWeek");
    this.weekData = weekStart;
    this.currentMonth = moment(weekStart).format("MMM, YYYY");
    for (let i = 0; i <= 6; i++) {
      const day1 = moment(weekStart).add(i, "days").format("DD");
      this.daysInLastMonth.push({
        day: day1,
        date: moment(weekStart).add(i, "days").format("MM/DD/YY"),
        dateFormat: moment(weekStart).add(i, "days").format("YYYY-MM-DD"),
      });
    }
  }

  previousWeek() {
    this.daysInLastMonth = [];
    this.count -= 1;
    const weekStart = moment(this.weekData)
      .subtract(1, "weeks")
      .startOf("isoWeek");
    this.weekData = weekStart;
    this.currentMonth = moment(weekStart).format("MMM, YYYY");
    for (let i = 0; i <= 6; i++) {
      const day1 = moment(weekStart).add(i, "days").format("DD");
      this.daysInLastMonth.push({
        day: day1,
        date: moment(weekStart).add(i, "days").format("MM/DD/YY"),
        dateFormat: moment(weekStart).add(i, "days").format("YYYY-MM-DD"),
      });
    }
  }

  selectDate(res) {
    console.log("res is");
    console.log(res);
    this.currentDate = res.date;
    this.currentMonth = moment(res.dateFormat).format("MMM, YYYY");
    this.numberflag = 0; // when new date is selected by default number flag is made to zero, so to avoid wrong notifications.
    this.selectedDateInfo = res;
    // this.dailyViewStatus = false;
    // if (this.currentDate === moment().format('MM/DD/YY')) {
    //   this.dailyViewStatus = true;
    // }
    this.checkButtonStatus();
    this.getCheckinCkeckoutData(res.dateFormat);
    this.getDailyStatusByDate(res.dateFormat);
    this.getDailyStatusProjectsList(res.dateFormat);
    this.dailyFormStatus = false; // when new date is selected , we are disabling the form , so that Add Status button can be seen.
  }

  populateRows(data) {
    for (let i = 0; i < data.length; ++i) {
      if (data[i].project_type !== 3) {
        this.newRow(data[i]);
      }
    }
    // this.calculateTotalHours();
  }

  editPopulateRows(data) {
    for (let i = 0; i < this.projectsList.length; ++i) {
      if (this.projectsList[i].project_type !== 3) {
        this.newRow1(this.projectsList[i]);
      }
    }
  }

  newRow1(info) {
    const fArr: FormArray = this.dailyStatusForm.get("hourslist") as FormArray;
    fArr.push(this.newGroup1(info));
  }

  newRow(info) {
    const fArr: FormArray = this.dailyStatusForm.get("hourslist") as FormArray;
    fArr.push(this.newGroup(info));
  }

  newGroup(data) {
    return this.fb.group({
      id: data.id,
      project_id: data.project_id,
      project_name: { value: data.project_name, disabled: true },
      last24hours: data.last24hours,
      next24hours: data.next24hours,
      obstacles: data.obstacles ? data.obstacles : "No",
      hours: data.hours ? data.hours : 0,
    });
  }

  newGroup1(data) {
    let res = null;
    let result = _.where(this.hoursData, { project_id: data.project_id });
    if (result.length === 1) {
      res = this.fb.group({
        id: result[0].id,
        project_id: result[0].project_id,
        project_name: { value: result[0].project_name, disabled: true },
        last24hours: result[0].last24hours ? result[0].last24hours : "",
        next24hours: result[0].next24hours ? result[0].next24hours : "",
        obstacles: result[0].obstacles ? result[0].obstacles : "No",
        hours: result[0].hours ? result[0].hours : 0,
      });
    } else {
      res = this.fb.group({
        id: data.id,
        project_id: data.project_id,
        project_name: { value: data.project_name, disabled: true },
        last24hours: data.last24hours,
        next24hours: data.next24hours,
        obstacles: data.obstacles ? data.obstacles : "No",
        hours: data.hours ? data.hours : 0,
      });
    }
    return res;
  }

  // get location
  getLocations() {
    this._api.getLocations().subscribe(
      (data) => {
        this.response = data;
        this.locationsList = this.response.data;
      },
      (error) => {}
    );
  }

  // init project
  initProject() {
    this.dailyStatusForm = this.fb.group({
      location_id: ["", [Validators.required]],
      date: [""],
      hourslist: this.fb.array([]),
    });
    this.populateRows(this.projectsList);
  }

  // init data project
  initDataProject(data) {
    this.dailyStatusForm = this.fb.group({
      location_id: [data.location_id, [Validators.required]],
      date: [""],
      hourslist: this.fb.array([]),
    });
    this.editPopulateRows(this.hoursData);
  }

  get getTitle() {
    return this.dailyStatusForm.get("project_name");
  }
  get last24Hours() {
    return this.dailyStatusForm.get("last24hours");
  }
  get timesheetMode() {
    return this.dailyStatusForm.get("project_type");
  }
  get next24Hours() {
    return this.dailyStatusForm.get("next24hours");
  }
  get obstacles() {
    return this.dailyStatusForm.get("obstacles");
  }
  get location() {
    return this.dailyStatusForm.get("location_id");
  }
  get hours() {
    return this.dailyStatusForm.get("hours");
  }

  showAddForm() {
    let selected_date = this.currentDate; //choosing another variable for current date.
    selected_date = this.datepipe.transform(selected_date, "yyyy-MM-dd"); // we are converting date to this format because the dates we are fetching from backend are in this format.

    let result = this.isValidDate(selected_date);
    if (result) {
      this.title = "YPoint Monthly Status";
      this.dailyFormStatus = true;
    } else {
      if (this.numberflag === 1) {
        this.toastr.error(
          "Today's Date :" +
            this.today +
            " Sorry,You cannot enter time in advance"
        );
      } else if (this.numberflag === 2) {
        this.toastr.error(
          "Sorry,You didn't update your status on time...YTracker is Locked for previous month"
        );
      } else {
        this.toastr.error(
          "Sorry, currently you cannot update status on this date"
        );
      }
    }
    this.buttonStatus = true;
    this.reset();
    this.alertService.clear();
  }

  isValidDate(selected_date) {
    /**condition to check if selected date is in current month  && if we are selecting future dates */

    if (
      selected_date >= this.current_month_start_date &&
      selected_date < this.next_month_start_date
    ) {
      if (selected_date <= this.today) {
        return true;
      } else if (selected_date > this.today) {
        this.numberflag = 1;
        return false;
      }
    }

    /**condition to check if selected date is in previous month , we are trying to lock the time entry for previous month after 3 days of new month starts */

    if (
      selected_date >= this.previous_month_start_date &&
      selected_date < this.current_month_start_date
    ) {
      /**  we have to permit only for first 3 days to enter previous month time , once new month is arrived  */
      if (this.fetchDayFromDate(this.today) <= 3) {
        return true;
      } else {
        this.numberflag = 2;
        return false;
      }
    }

    this.numberflag = 0;

    return false;
  }

  fetchDayFromDate(date) {
    let day = this.datepipe.transform(date, "dd");
    return parseInt(day); //converting string to Integer
  }

  backToList() {
    this.title = "YPoint Daily Status";
    this.dailyFormStatus = false;
  }

  showEditForm(data) {
    this.alertService.clear();
    this.title = "Edit YPoint Daily Status";
    this.initDataProject(data);
    this.dailyFormStatus = true;
  }

  // reset form
  reset() {
    this.isSubmitted = false;
    // this.dailyStatusForm.reset();
    this.initProject();
  }

  // list of projects
  getDailyStatusProjectsList(selectedDate) {
    this._api.getDailyStatusProjectsList({ date: selectedDate }).subscribe(
      (data) => {
        this.response = data;
        this.projectsList = this.response.data;
      },
      (error) => {}
    );
  }

  getUserTimeLimitData() {
    this._api.getUserTimeLimitData({}).subscribe(
      (data) => {
        this.response = data;
        this.timesheetData = this.response.data;
      },
      (error) => {}
    );
  }

  change(hours, project_name, index) {
    const res = _.where(this.timesheetData, { project_name: project_name });
    this.j = index;
    if (res[0].time_limit_daily === 0) {
      // nothing
      this.name1 = "";
      this.flag = false;
    }
    // else if (res[0].time_limit_daily > hours) {
    //   console.log('come to else if2');
    //   this.name1 = 'Daily Limit is ' + res[0].time_limit_daily;
    //   this.flag = false;
    // }
    else if (res[0].time_limit_daily < hours) {
      this.name1 =
        "You cross your daily limit, your daily limit is " +
        res[0].time_limit_daily;
      this.flag = false;
    } else {
      this.name1 = "";
      this.flag = false;
    }
  }

  // list of daily status
  getDailyStatusByDate(selectedDate) {
    this._api.getDailyStatusByDate({ date: selectedDate }).subscribe(
      (data) => {
        this.response = data;
        this.dailyStatusInfo = this.response.data;
        this.next24HoursData = this.response.next24hours;
        this.hoursData = this.response.hoursData;
      },
      (error) => {
        // console.log(error);
      }
    );
  }

  // calculateTotalHours() {
  //   const obj = this.dailyStatusForm.controls['hourslist'].value;
  //   let cnt = 0;
  //   for (let i = 0; i < obj.length; i++) {
  //     cnt += obj[i].hours;
  //   }
  //   this.totalHours = cnt;
  // }

  // add project
  addDailyStatus() {
    this.isSubmitted = true;
    this.dailyStatusForm.controls.date.setValue(
      this.selectedDateInfo.dateFormat
    );
    if (!this.dailyStatusForm.valid) {
      return;
    }
    this._api.addOrUpdateDailyStatus(this.dailyStatusForm.value).subscribe(
      (data) => {
        this.response = data;
        if (this.response.success) {
          this.toastr.success(this.response.message);
          this.getDailyStatusProjectsList(this.selectedDateInfo.dateFormat);
          this.getDailyStatusByDate(this.selectedDateInfo.dateFormat);
          this.backToList();
        } else {
          this.toastr.error(this.response.message);
        }
      },
      (error) => {}
    );
  }

  deleteDailyStatusById() {
    this._api
      .deleteDailyStatusById({ id: this.dailyStatusInfo[0].id })
      .subscribe(
        (data) => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.cancelClicked = true;
            this.getDailyStatusByDate(this.selectedDateInfo.dateFormat);
          } else {
            this.toastr.error(this.response.message);
          }
        },
        (error) => {}
      );
  }
}