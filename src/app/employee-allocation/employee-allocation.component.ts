import { Component, OnInit } from '@angular/core';
// Api Service
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-employee-allocation',
  templateUrl: './employee-allocation.component.html',
  styleUrls: ['./employee-allocation.component.css']
})
export class EmployeeAllocationComponent implements OnInit {

  employeeAllocationList = true;
  response: any;
  employeesList = [];
  title: String = 'List Of Employee Allocations';
  constructor(public _api: ApiService) { }

  ngOnInit() {
    this.getEmployeeProjectsList();
  }

   // get details
   getEmployeeProjectsList() {
    this._api.getEmployeeProjectsList()
      .subscribe(
        data => {
          this.response = data;
          this.employeesList = this.response.data;
        },
        error => {
        });
  }

}
