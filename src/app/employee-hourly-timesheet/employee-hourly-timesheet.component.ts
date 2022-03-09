import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
  FormArray,
} from "@angular/forms";
// Api Service
import { ApiService } from "../_services/api.service";
// Alert Service
import { AlertService } from "../_services/alert.service";
// custom settings Import
import { AppSettings } from "../app.settings";

import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";

import * as moment from "moment";
import * as _ from "underscore";

@Component({
  selector: "app-employee-hourly-timesheet",
  templateUrl: "./employee-hourly-timesheet.component.html",
  styleUrls: ["./employee-hourly-timesheet.component.css"],
})
export class EmployeeHourlyTimesheetComponent implements OnInit {
  buttonStatus = true;
  title: String = "YPoint Hourly Status";
  isSubmitted = false;
  hourlyFormStatus: Boolean = false;
  dailyViewStatus: Boolean = false;
  projectsList = [];
  timeSheetList = [];
  clientsList = [];
  formData;
  statusInfo = [];
  projectInfo = [];
  singleLocation = [];
  userData: any;
  totalHours = 0;
  // create form group
  hourlyStatusForm: FormGroup;
  response: any;
  dailyStatusList = [];

  dailyStatusInfo = [];
  hoursData = [];
  hourlyStatus = [];
  calendarOneWeek: Date;
  calendarTwoWeek: Date;
  calendarThreeWeek: Date;

  temp: any;
  daysInLastMonth: any;
  starttime: any;
  endtime: any;
  currentMonth: any;
  currentDate: any;
  weekData: any;
  selectedDateInfo: any;
  pid_status = false;
  count = 0;
  hour: any;
  val: boolean;
  hourlyStatusInfo = [];
  checkincheckoutdata = [];
  next24HoursData: any;
  name1: any;
  j = 0;
  flag: boolean;
  public popoverTitle: String = "Delete Confirmation Message";
  public popoverMessage: String =
    "Please confirm.., Do you really want to delete the hourly status?";
  public confirmClicked: Boolean = false;
  public cancelClicked: Boolean = false;
  checkin = [];
  checkout = [];
  hourly: any;

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
    // console.log(this.userData);
    this.getDatesForLockTimeEntry(); // fetching server side dates(GMT FORMAT) for current month , previous month start and end dates as well as today's date
  }

  ngOnInit() {
    this.dailyViewStatus = true;
    this.initProject();
    this.getDaysOfMonth();
    this.getDailyStatusProjectsList(moment().format("YYYY-MM-DD"));
    this.statusInfo = AppSettings.location;
    this.projectInfo = AppSettings.projectType;
    this.currentDate = moment().format("MM/DD/YY");
    this.getHourlyTimeSheetData(moment().format("YYYY-MM-DD"));
    this.checkButtonStatus(); // we enable or disable edit status and delete status based on below conditions.

    // var t = moment('11-11-2019 11:31 am', 'MM-DD-YYYY hh:mm a').utc().format("YYYY-MM-DD hh:mm a");
    // var a = moment.utc("2019-11-11 11:31 am", "YYYY-MM-DD hh:mm a").local().format('YYYY-MM-DD hh:mm a');
    // console.log('t', t);
    // console.log('a', a);
    // var utctime = moment().utc().format("hh:mm a");
    // console.log('utctime', utctime);
    // var utcdate = moment().utc().format("YYYY-MM-DD");
    // console.log('utcdate', utcdate);
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

  startTime(event, index) {
    this.starttime = event;
    if (this.endtime != null) {
      const res = moment.duration(
        moment(this.endtime).diff(moment(this.starttime))
      );
      const min = res.asMinutes();
      this.hour = (min / 60).toFixed(2);
      const faControl = (<FormArray>(
        this.hourlyStatusForm.controls["hourslist"]
      )).at(index);
      faControl["controls"].hours.setValue(this.hour);
    }
  }

  endTime(data, index) {
    this.endtime = data;
    if (this.starttime != null) {
      const res = moment.duration(
        moment(this.endtime).diff(moment(this.starttime))
      );
      const min = res.asMinutes();
      this.hour = (min / 60).toFixed(2);
      const faControl = (<FormArray>(
        this.hourlyStatusForm.controls["hourslist"]
      )).at(index);
      faControl["controls"].hours.setValue(this.hour);
      // return this.hour;
    }
  }

  selectDate(res) {
    this.currentDate = res.date;
    this.currentMonth = moment(res.date).format("MMM, YYYY");
    this.selectedDateInfo = res;
    // this.dailyViewStatus = false;
    // if (this.currentDate === moment().format('MM/DD/YY')) {
    //   this.dailyViewStatus = true;
    // }
    this.numberflag = 0; // when new date is selected by default number flag is made to zero, so to avoid wrong notifications.
    this.checkButtonStatus();
    this.getHourlyTimeSheetData(res.dateFormat);
    this.getDailyStatusProjectsList(res.dateFormat);
    this.hourlyFormStatus = false; // when new date is selected , we are disabling the form , so that Add Status button can be seen.
  }

  populateRows(data) {
    for (let i = 0; i < data.length; ++i) {
      if (data[i].project_type === 3) {
        this.newRow(data[i]);
      }
    }
    // this.calculateTotalHours();
  }

  editPopulateRows(data) {
    for (let i = 0; i < this.projectsList.length; ++i) {
      if (this.projectsList[i].project_type === 3) {
        this.newRow1(this.projectsList[i]);
      }
    }
  }

  newRow1(info) {
    const fArr: FormArray = this.hourlyStatusForm.get("hourslist") as FormArray;
    fArr.push(this.newGroup1(info));
  }

  newRow(info) {
    const fArr: FormArray = this.hourlyStatusForm.get("hourslist") as FormArray;
    fArr.push(this.newGroup(info));
  }

  newGroup(data) {
    return this.fb.group({
      id: data.id,
      project_id: data.project_id,
      project_name: { value: data.project_name, disabled: true },
      checkin_time: data.checkin_time,
      checkout_time: data.checkout_time,
      last24hours: data.last24hours, // it is work done in last 24 hours
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
        // checkin_time: result[0].checkin_time ? new Date(moment.utc(result[0].checkin_time).local().format('YYYY-MM-DD hh:mm a')) : '',
        // checkout_time: result[0].checkout_time ? new Date(moment.utc(result[0].checkout_time).local().format('YYYY-MM-DD hh:mm a')) : '',
        checkin_time: result[0].checkin_time
          ? new Date(result[0].checkin_time)
          : "",
        checkout_time: result[0].checkout_time
          ? new Date(result[0].checkout_time)
          : "",
        last24hours: result[0].last24hours ? result[0].last24hours : "",
        hours: result[0].hours ? result[0].hours : 0,
      });
    } else {
      res = this.fb.group({
        id: data.id,
        project_id: data.project_id,
        project_name: { value: data.project_name, disabled: true },
        checkin_time: data.checkin_time,
        checkout_time: data.checkout_time,
        last24hours: data.last24hours,
        hours: data.hours ? data.hours : 0,
      });
    }
    return res;
  }

  // init project
  initProject() {
    this.buttonStatus = true;
    this.hourlyStatusForm = this.fb.group({
      date: [""],
      hourslist: this.fb.array([]),
    });
    this.populateRows(this.projectsList);
  }

  // init data project
  initDataProject(data) {
    this.buttonStatus = false;
    this.hourlyStatusForm = this.fb.group({
      date: [""],
      hourslist: this.fb.array([]),
    });
    this.editPopulateRows(this.hoursData);
  }

  get getTitle() {
    return this.hourlyStatusForm.get("project_name");
  }
  get checkin_time() {
    return this.hourlyStatusForm.get("checkin_time");
  }
  get checkout_time() {
    return this.hourlyStatusForm.get("checkout_time");
  }
  get hours() {
    return this.hourlyStatusForm.get("hours");
  }
  get last24Hours() {
    return this.hourlyStatusForm.get("last24hours");
  }

  showAddForm() {
    let selected_date = this.currentDate; //choosing another variable for current date.
    selected_date = this.datepipe.transform(selected_date, "yyyy-MM-dd"); // we are converting date to this format because the dates we are fetching from backend are in this format.
    let result = this.isValidDate(selected_date);

    if (result) {
      this.title = "YPoint Hourly Status";
      this.hourlyFormStatus = true;
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
    this.title = "YPoint Hourly Status";
    this.hourlyFormStatus = false;
  }

  showEditForm(data) {
    this.alertService.clear();
    this.title = "Edit YPoint Hourly Status";
    this.initDataProject(data);
    this.hourlyFormStatus = true;
  }

  // reset form
  reset() {
    this.isSubmitted = false;
    // this.hourlyStatusForm.reset();
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

  // list of daily status
  getHourlyTimeSheetData(selectedDate) {
    this._api.getHourlyTimeSheetData({ date: selectedDate }).subscribe(
      (data) => {
        this.response = data;
        this.hourlyStatusInfo = this.response.data;
        this.hoursData = this.response.hoursData;
        //   var res = this.hourlyStatusInfo;
        //   console.log('res length', res.length);
        //   for (let i = 0; i < res.length; i++) {
        //     console.log('res[i].checkin_time', res[i].checkin_time);
        //     console.log('res[i].checkout_time', res[i].checkout_time);
        //     console.log('res[i].hours', res[i].hours);
        //     this.checkin[i] = moment.utc(res[i].checkin_time).local().format('YYYY-MM-DD, hh:mm a');
        //     this.checkout[i] =  moment.utc( res[i].checkout_time).local().format('YYYY-MM-DD, hh:mm a');
        // }
        // console.log('fg', this.checkin);
        // console.log('hjk', this.checkout);
      },
      (error) => {
        // console.log(error);
      }
    );
  }

  // change(project_name, index) {
  //   const res = _.where(this.projectsList, { project_name: project_name });
  //   const result = _.where(this.hourlyStatusInfo, {project_name: project_name});
  //   let sum = 0;
  //   for (let i = 0; i < result.length; i++ ) {
  //     sum += result[i].hours;
  //   }
  //   this.totalHours = sum;
  //   console.log('hourlyStatusInfo', this.hourlyStatusInfo);
  //   console.log('result', result);
  //   console.log('response', res);
  //   this.j = index;
  //   console.log('deadline', res[0].deadline);
  //   if (res[0].deadline === 0) {
  //     // nothing
  //     console.log('coming to if');
  //     this.name1 = '';
  //     this.flag = false;
  //   }
  //   else {
  //       if (res[0].deadline >= this.totalHours) {
  //         // this.name1 = 'Deadline is ' + res[0].deadline;
  //         // console.log('this.name1', this.name1);
  //         this.name1 = '';
  //         this.flag = true;
  //         return this.name1;
  //       }
  //       else {
  //         this.name1 = 'You cross your deadline' + res[0].deadline + 'hours' ;
  //         console.log(this.name1);
  //         this.flag = true;
  //         return this.name1;
  //       }
  //   }
  // }

  saveData() {
    this.isSubmitted = true;
    this.hourlyStatusForm.controls.date.setValue(
      this.selectedDateInfo.dateFormat
    );
    if (!this.hourlyStatusForm.valid) {
      return;
    }
    this._api.insertHourlyTime(this.hourlyStatusForm.value).subscribe(
      (data) => {
        this.response = data;
        if (this.response.success) {
          this.toastr.success(this.response.message);
          this.getDailyStatusProjectsList(this.selectedDateInfo.dateFormat);
          this.getHourlyTimeSheetData(this.selectedDateInfo.dateFormat);
          this.backToList();
        } else {
          this.toastr.error(this.response.message);
        }
      },
      (error) => {}
    );
  }

  deleteHourlyStatusById() {
    this._api
      .deleteHourlyStatusById({ id: this.hourlyStatusInfo[0].id })
      .subscribe(
        (data) => {
          this.response = data;
          if (this.response.success) {
            this.toastr.success(this.response.message);
            this.cancelClicked = true;
            this.getHourlyTimeSheetData(this.selectedDateInfo.dateFormat);
          } else {
            this.toastr.error(this.response.message);
          }
        },
        (error) => {}
      );
  }
}
