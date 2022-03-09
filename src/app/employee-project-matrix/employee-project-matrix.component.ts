import { Component, OnInit } from "@angular/core";

import { ApiService } from "../_services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import * as XLSX from "xlsx";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ViewMatrixClickedDataComponent } from "../view-matrix-clicked-data/view-matrix-clicked-data.component";

@Component({
  selector: "app-employee-project-matrix",
  templateUrl: "./employee-project-matrix.component.html",
  styleUrls: ["./employee-project-matrix.component.css"],
})
export class EmployeeProjectMatrixComponent implements OnInit {
  projectsList = [];
  usersList = [];
  previousmonthdata = [];
  currentmonthdata = [];
  response: any;
  title: String = "List Of Projects";
  previousMonthFlag: boolean = false;
  currentMonthFlag: boolean = true;
  eventvalue: number = 0; // default we will fetch details of people whose daily time entry not required [dailyTimeEntryRequiredFlag]

  currentmonthMatrixClickedData = [];
  previousmonthMatrixClickedData = [];

  constructor(
    public _api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * SCOPE OF IMPROVEMENTS IN FUTURE...
   *
   * 1.We are currently using 2 Tables to display previous month and current month data , but if We build a Model for data fetched from Backend
   * with one table we can show 2 months data by selecting necessary month
   *
   *
   */

  ngOnInit() {
    this.setCurrentMonthFlag();
  }

  onChange(value) {
    this.eventvalue = parseInt(value);

    if (this.currentMonthFlag) {
      this._api.getCurrentMonthMatrixData(this.eventvalue).subscribe(
        (data: any) => {
          this.currentmonthdata = data;
          console.log(data);
        },
        (error) => {
          console.log(error);
          alert("sorry...error in fetching data from backend");
        }
      );
    }

    if (this.previousMonthFlag) {
      this._api.getPreviousMonthMatrixData(this.eventvalue).subscribe(
        (data: any) => {
          this.previousmonthdata = data;
          console.log(data);
        },
        (error) => {
          console.log(error);
          alert("sorry...error in fetching data from backend");
        }
      );
    }
  }

  DetailsOfEmployeeWorkDoneOnSpecificProject(projectID, employeeID) {
    //NOTE : We match these conditions in view-matrix-clicked-data COMPONENT while fetching respective employee or project data
    let url;
    if (this.currentMonthFlag) {
      url = this.router.createUrlTree([
        "/employeeprojectworkdone",
        "currentmonth",
        employeeID,
        projectID,
      ]);
    }

    if (this.previousMonthFlag) {
      url = this.router.createUrlTree([
        "/employeeprojectworkdone",
        "previousmonth",
        employeeID,
        projectID,
      ]);
    }

    window.open(url + "", "_blank"); // converting url to string format
  }

  DetailsOfEmployeeTotalWorkDone(employeeID) {
    let url;
    if (this.currentMonthFlag) {
      url = this.router.createUrlTree([
        "/employeetotalworkdone",
        "currentmonth",
        employeeID,
      ]);
    }
    if (this.previousMonthFlag) {
      url = this.router.createUrlTree([
        "/employeetotalworkdone",
        "previousmonth",
        employeeID,
      ]);
    }

    window.open(url + "", "_blank"); // converting url to string format
  }

  DetailsOfTotalWorkDoneOnSpecificProject(projectID) {
    let url;
    if (this.currentMonthFlag) {
      url = this.router.createUrlTree([
        "/projecttotalworkdone",
        "currentmonth",
        projectID,
        this.eventvalue,
      ]);
    }
    if (this.previousMonthFlag) {
      url = this.router.createUrlTree([
        "/projecttotalworkdone",
        "previousmonth",
        projectID,
        this.eventvalue,
      ]);
    }

    // alert(employeeID + "...." + typeof employeeID);
    window.open(url + "", "_blank"); // converting url to string format
  }

  setPreviousMonthFlag() {
    this.previousMonthFlag = true;
    this.currentMonthFlag = false;
    console.log("previous", this.previousMonthFlag, this.currentMonthFlag);

    this._api.getPreviousMonthMatrixData(this.eventvalue).subscribe(
      (data: any) => {
        this.previousmonthdata = data;
        console.log(data);
      },
      (error) => {
        alert("sorry...error in fetching data from backend");
      }
    );
  }

  setCurrentMonthFlag() {
    this.currentMonthFlag = true;
    this.previousMonthFlag = false;
    console.log("current", this.currentMonthFlag, this.previousMonthFlag);

    this._api.getCurrentMonthMatrixData(this.eventvalue).subscribe(
      (data: any) => {
        this.currentmonthdata = data;
        console.log(data);
      },
      (error) => {
        alert("sorry...error in fetching data from backend");
      }
    );
  }

  exportToExcelReport1(): void {
    /* table id is passed over here */
    let element = document.getElementById("previousmonthtable");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, "Previous Month Summary Report.xlsx");
  }
  exportToExcelReport2(): void {
    /* table id is passed over here */
    let element = document.getElementById("currentmonthtable");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, "Current Month Summary Report.xlsx");
  }
}
