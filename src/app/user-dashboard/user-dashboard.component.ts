import { Component, OnInit, ViewChild } from '@angular/core';
// Api Service
import { ApiService } from '../_services/api.service';
import { IDatePickerConfig } from 'ng2-date-picker';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import * as moment from 'moment';
import * as _ from 'underscore';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  // @ViewChild(BaseChartDirective)
  // public chart: BaseChartDirective;
  // charts
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    options: {
      animation: {
          duration: 2000,
      },
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Hours',
          fontSize: 18,
          fontFamily: 'sans-serif',
          fontStyle: 'bold'
        },
        ticks: {
          beginAtZero: true,
          fontSize: 14
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Days',
          fontSize: 18,
          fontFamily: 'sans-serif',
          fontStyle: 'bold'
        },
        ticks: {
          fontSize: 14
        }
      }]
    }
  };
  barChartLabels: any = [];
  projectsList = [];
  projectsListData = [];
  barChartType: String = 'bar';
  slectedProjectData: String;
  public barChartLegend = true;
  public barChartPlugins = [];
  userData: any;
  title: String = 'Daily Status Monthly Report';
  public chartColors = [
    '#1c258a', '#0000FF', '#3ebf9b', '#4d86dc', '#f3af37'
    // '#B22222', '#FFE29A', '#D2B48C', '#90EE90', '#FF69B4', '#EE82EE', '#6A5ACD',
    // '#b8436d', '#9ACD32', '#00d9f9', '#800080', '#FF6347', '#DDA0DD', '#a4c73c', '#a4add3',
    // '#008000', '#DAA520', '#00BFFF', '#2F4F4F', '#FF8C00', '#A9A9A9', '#FFB6C1', '#00FFFF', '#6495ED', '#7FFFD4', '#F0F8FF', '#7FFF00',
    // '#008B8B', '#9932CC', '#E9967A', '#8FBC8F', '#483D8B', '#D3D3D3', '#ADD8E6'
  ];
  hours: any;
  response: any;
  countData: any;
  timesheetType = '0';
  config: IDatePickerConfig = {
    format: 'YYYY-MM'
  };
  timesheetData = [];

  barChartData: any[] = [];
  projectType: String;
  selectedDate: any;
  selectedData: any;
  project: any;
  year: any;
  month: any;
  project_name: any;
  monthPickerStatus: Boolean = true;
  projectStatus: Boolean = true;
  Arr = Array; // Array type captured in a variable
  num: Number = 20;
  selectMonth: any;
  y: any = [];
  m: any = [];
  projectList = [];
  previousInfo = [];
  currentInfo = [];
  delay_days_current_month: number;
  delay_days_last_month: number;
  hours_current_month: number;
  hours_last_month: number;
  hoursWorked_Delay_LastTimeEntryReport :any ; //for current and previous month.

  constructor(
    public _api: ApiService
  ) {
  }

  ngOnInit() {
    this.initCount();
    this.selectedDate = moment().format('YYYY-MM');
    // this.loadGraph(moment().format('YYYY'), moment().format('MM'), );
    // this.loadGraph1(moment().format('YYYY'), moment().format('MM'), this.project_id);
    // this.year = moment().format('YYYY');
    // this.month = moment().format('MM');
    this.getProjectsList();
    this.getHWDLReport();// hours worked, delay and last time entry report
  }

  initCount() {
    this._api.getUsersCountsDashboard({})
      .subscribe(
        data => {
          this.response = data;
          this.countData = this.response.data[0];
        },
        error => {
        });
  }


  getHWDLReport(){
    this._api.getHoursWorkedDelayLastTimeentryReport()
      .subscribe(
        data => {
       this.response = data;
      //  this.hoursWorked_Delay_LastTimeEntryReport = data ; 
       this.currentInfo = this.response.data.currentmonthdata[0];
       this.previousInfo = this.response.data.previousmonthdata[0];
       console.log('Previous', this.previousInfo)
       console.log('current', this.currentInfo)
      },
      error=>{

      });
  }

  selectedMonth(event) {
    // console.log('event', event.target.value);
    // console.log('split', event.target.value.split('-'));
    // const data = event.target.value.split('-');
    // const y = data[0];
    // const m = data[1];
    // console.log('y', y);
    // console.log('m', m);
    //this.arr = (data.user_names).split(',');
    this.selectMonth = event;
    this.year = moment(event).format('YYYY');
    this.month = moment(event).format('MM');
    //  console.log(this.year, this.month, this.project);
    // this.project = this.projectsList[0].project_id;
    // console.log('project list length',  this.projectsList.length)
   this.projectsList.length > 0 ? this.loadGraph() : '';
    // this.projectsList.length > 0 ? this.loadGraph() : '';
   // this.loadGraph();

  }

  changeProject(event) {
    this.project = event.target.value;
    console.log('project id', this.project);
    this.loadGraph();
    // this.refreshChart();
  }

  chartTypeChange(event) {
    this.barChartType = event.target.value;
    this.refreshChart();
  }

  loadGraph() {
    const info = {
      year: this.year,
      month: this.month,
      project_id: this.project
    };
    console.log('hii', info);
    this.timesheetData = [];
    this._api.getUserHoursReport(info)
      .subscribe(
        data => {
          this.response = data;
          this.timesheetData = this.response.data;
          console.log('timesheetData', this.timesheetData);
          _.map(this.timesheetData, (res) => {
            res['day1'] = moment(res.date).format('YYYY-MM-DD');
          });
          this.dailyTimesheetGraphSettings(this.year, this.month);
        },
        error => {
          // console.log(error);
        });
  }

  getHours(data) {
    let res;
    res = _.where(this.timesheetData, data);
    if (res[0]) {
      return res[0].hours;
    } else {
      return 0;
    }
  }

  dailyTimesheetGraphSettings(year, month) {
    this.barChartLabels = [];
    const startDate = moment([year, month - 1]);
    // Clone the value before .endOf()
    const endDay = moment(startDate).endOf('month').format('D');
    for (let k = 1; k <= Number(endDay); k++) {
      this.barChartLabels.push(k);
    }
    const r = []; this.barChartData = [];
    for (let j = 1; j <= Number(endDay); j++) {
      const info = {
        day1: moment(year + '-' + month + '-' + j).format('YYYY-MM-DD')
      };
      r.push(this.getHours(info));
    }
    this.barChartData.push(
      {
        data: r,
        label: 'Total Hours',
        stack: 'a',
        fill: false,
        backgroundColor: this.chartColors[0],
        borderColor: this.chartColors[0],
        pointBackgroundColor: this.chartColors[0],
        pointBorderColor: this.chartColors[0],
        pointHoverBackgroundColor: this.chartColors[0],
        pointHoverBorderColor: this.chartColors[0],
      }
    );
    this.refreshChart();
  }

  // list of projects
  getProjectsList() {
    this._api.getUserProjectsList({})
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.data;
          // console.log('projectsList', this.projectsList[0].project_id);
          this.project = this.projectsList.length > 0 ? this.projectsList[0].project_id : 0;
          this.loadGraph();
          // console.log('projectid', this.project);
        },
        error => {
        });
  }


  refreshChart() {
    // this.chart.chart.update();
    // this.chart.chart.render();
    setTimeout(() => {
      // if (this.chart && this.chart.chart && this.chart.chart.config) {
      //   this.chart.chart.config.data.labels = this.barChartLabels;
      //   this.chart.chart.config.data.datasets = this.barChartData;
      //   this.chart.chart.config.chart = this.barChartType;
      //   this.chart.chart.update();
      // }
    });
  }
}
