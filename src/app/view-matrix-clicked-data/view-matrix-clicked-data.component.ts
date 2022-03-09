import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../_services/api.service";

@Component({
  selector: "app-view-matrix-clicked-data",
  templateUrl: "./view-matrix-clicked-data.component.html",
  styleUrls: ["./view-matrix-clicked-data.component.css"],

  /**
   * AUTHOR : K.SAI PRASANNA KUMAR
   * Created on : 24th Aug 2021
   */
})
export class ViewMatrixClickedDataComponent implements OnInit {
  employee_id: any;
  project_id: any;
  month: any;
  dailyTimeEntryRequiredFlag: any;
  fetchedData = []; // the data we fetched from respective API is stored in this list.
  employeeworkdoneonspecificproject: boolean = false;
  employeetotalworkdone: boolean = false;
  totalworkdoneonaproject: boolean = false;
  displaymonth = '';// deafult month to display is shown empty string

  constructor(private route: ActivatedRoute, public _api: ApiService) {}

  ngOnInit() {
    // the data we fetch through routing snapshot would be usually string , so all variables below are of type string
    this.employee_id = this.route.snapshot.params["employee_id"];
    this.month = this.route.snapshot.params["month"];
    this.project_id = this.route.snapshot.params["project_id"];
    this.dailyTimeEntryRequiredFlag =
      this.route.snapshot.params["dailyTimeEntryRequiredFlag"];
    this.fetchDataBasedOnRoutingConditions();
  }

  /**
   * FUTURE SCOPE :
   */

  /**
   * We verify 3 conditions for both current and previous months.
   * 1.if project id and employee id exist :  IT GIVES DETAILS OF WORK DONE ON SPECIFIC PROJECT
   * 2.if only employee id existts : IT GIVES DETAILS OF TOTAL EMPLOYEE WORK DONE
   * 3.If only project id exists : IT GIVES COMPLETE WORKDONE DETAILS ON A SPECIFIC PROJECT
   */
  fetchDataBasedOnRoutingConditions() {
    //we fetch and display data based on the month either current or previous month.
    this.ifBelongtoCurrentMonth();
    this.ifBelongtoPreviousMonth();
  }

  ifBelongtoCurrentMonth() {
    let projectID = parseInt(this.project_id);
    let employeeID = parseInt(this.employee_id);
    let dailyTimeEntryRequiredFlag = parseInt(this.dailyTimeEntryRequiredFlag);

    if (
      this.month === "currentmonth" &&
      this.project_id === undefined &&
      this.employee_id !== undefined
    ) {
      this.displaymonth = "Current Month" ;
      this.employeetotalworkdone = true;
      this._api
        .getCurrentMonthTotalEmployeeWorkdoneDetails({
          employeeID: employeeID,
        })
        .subscribe(
          (data: any) => {
            this.fetchedData = data;
            console.log(data);
          },
          (error) => {
            console.log(error);
            // alert("sorry...error in fetching data from backend")
          }
        );
    }

    // we use project id and employee id to fetch the details
    if (
      this.month === "currentmonth" &&
      this.project_id !== undefined &&
      this.employee_id !== undefined
    ) {
      this.displaymonth = "Current Month" ;
      this.employeeworkdoneonspecificproject = true;
      this._api
        .getCurrentMonthEmployeeWorkdoneDetailsOnSpecificProject({
          projectID: projectID,
          employeeID: employeeID,
        })
        .subscribe(
          (data: any) => {
            this.fetchedData = data;
            console.log(data);
          },
          (error) => {
            console.log(error);
            // alert("sorry...error in fetching data from backend")
          }
        );
    }

    if (
      this.month === "currentmonth" &&
      this.project_id !== undefined &&
      this.dailyTimeEntryRequiredFlag !== undefined
    ) {

      this.displaymonth = "Current Month" ;
      this.totalworkdoneonaproject = true;
      this._api
        .getCurrentMonthTotalWorkdoneOnProjectDetails({
          projectID: projectID,
          dailyTimeEntryRequiredFlag: dailyTimeEntryRequiredFlag,
        })
        .subscribe(
          (data: any) => {
            this.fetchedData = data;
            console.log(data);
          },
          (error) => {
            console.log(error);
            // alert("sorry...error in fetching data from backend")
          }
        );
    }
  }

  ifBelongtoPreviousMonth() {
    let projectID = parseInt(this.project_id);
    let employeeID = parseInt(this.employee_id);
    let dailyTimeEntryRequiredFlag = parseInt(this.dailyTimeEntryRequiredFlag);

    if (
      this.month === "previousmonth" &&
      this.project_id === undefined &&
      this.employee_id !== undefined
    ) {
      this.displaymonth = "Previous Month" ;
      this.employeetotalworkdone = true;
      this._api
        .getPreviousMonthTotalEmployeeWorkdoneDetails({
          employeeID: employeeID,
        })
        .subscribe(
          (data: any) => {
            this.fetchedData = data;
            console.log(data);
          },
          (error) => {
            console.log(error);
            // alert("sorry...error in fetching data from backend")
          }
        );
    }

    // we use project id and employee id to fetch the details
    if (
      this.month === "previousmonth" &&
      this.project_id !== undefined &&
      this.employee_id !== undefined
    ) {

      this.displaymonth = "Previous Month" ;
      this.employeeworkdoneonspecificproject = true;
      this._api
        .getPreviousMonthEmployeeWorkdoneDetailsOnSpecificProject({
          projectID: projectID,
          employeeID: employeeID,
        })
        .subscribe(
          (data: any) => {
            this.fetchedData = data;
            console.log(data);
          },
          (error) => {
            console.log(error);
            // alert("sorry...error in fetching data from backend")
          }
        );
    }

    if (
      this.month === "previousmonth" &&
      this.project_id !== undefined &&
      this.dailyTimeEntryRequiredFlag !== undefined
    ) {

      this.displaymonth = "Previous Month" ;
      this.totalworkdoneonaproject = true;
      this._api
        .getPreviousMonthTotalWorkdoneOnProjectDetails({
          projectID: projectID,
          dailyTimeEntryRequiredFlag: dailyTimeEntryRequiredFlag,
        })
        .subscribe(
          (data: any) => {
            this.fetchedData = data;
            console.log(data);
          },
          (error) => {
            console.log(error);
            // alert("sorry...error in fetching data from backend")
          }
        );
    }
  }


  key:string ='sort';
  reverse : boolean =false;

  sorting(key){
    this.key =key;
    this.reverse = !this.reverse;
  }
}
