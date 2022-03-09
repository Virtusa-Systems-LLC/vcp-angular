import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
// Api Service
import { ApiService } from '../../_services/api.service';
// Alert Service
import { AlertService } from '../../_services/alert.service';

import * as Handsontable from 'handsontable';

import * as moment from 'moment';

import * as _ from 'underscore';

@Component({
  selector: 'app-user-weekly',
  templateUrl: './user-weekly.component.html',
  styleUrls: ['./user-weekly.component.css']
})
export class UserWeeklyComponent implements OnInit, AfterViewInit {

  projectsList = [];

  userData: any;

  colDataset = [];
  rowDataset = [];
  columnsOption = [];

  dataset: any[];

  timesheetsList = [];
  dumptimesheetsList = [];
  _currentDateView: any;
  hot2: any;
  resultListData = [];
  selectedDate: any;
  container: any;
  commentResult = [];
  response: any;
  constructor(public _api: ApiService, private alertService: AlertService) {
  }

  ngOnInit() {
    this._currentDateView = moment().format('YYYY/MM/DD');
    this.weeks(moment().format('YYYY-MM-01'), moment().format('YYYY'), moment().format('MM'));
  }


  ngAfterViewInit() {
    this.container = document.getElementById('example3');

    // this.hot2 = new Handsontable(this.container, {
    //   // data: [],
    //   rowHeaders: true,
    //   colHeaders: true,
    //   // performance tip: turn off calculations
    //   contextMenu: false,
    //   autoRowSize: true,
    //   height: 200,
    //   autoColumnSize: true,
    //   stretchH: 'all',
    //   autoWrapRow: true,
    //   type: 'numeric',
    //   // colWidths: 70,
    //   fillHandle: false,
    //   rowHeaderWidth: 180,
    //   allowEmpty: true,
    //   // fixedColumnsLeft: (this.timesheetsList[0].length - 1),
    //   correctFormat: true,
    //   comments: true
    // });

  }

  applyColorValueRenderer(instance, td, row, col, prop, value, cellProperties) {
    // Handsontable.renderers.TextRenderer.apply(this, arguments);

    if (value >= 0) {
      td.style.color = 'green';
      // td.style.background = '#CEC';
    } else if (value < 0) {
      td.style.color = 'red';
      // td.style.background = '#CEC';
    }
    if (!value || value === '') {
      // td.style.background = '#EEE';
    }
  }

  selectedMonth(event) {

    const year = moment(event.date).format('YYYY');
    const month = moment(event.date).format('MM');
    console.log(year + '-' + month + '-01', year, month);
    this.weeks(year + '-' + month + '-01', year, month);
  }

  weeks(date, year, month) {
    const startWeek = moment(date).startOf('month').week();
    const endWeek = moment(date).endOf('month').week();
    // console.log(startWeek);
    // console.log(endWeek);
    const calendar = [];
    for (let week = startWeek; week < endWeek; week++) {
      calendar.push({
        week: week,
        days: Array(7).fill(0).map((n, i) => moment().week(week).startOf('week').clone().add(n + i, 'day')),
        weekstartdate: moment(date).week(week).weekday(1).format('YYYY-MM-DD'),
        weekenddate: moment(date).week(week).weekday(7).format('YYYY-MM-DD')
      });
    }
    // console.log(calendar);
    this.getWeeklyTimesheets(calendar, year, month);
  }

  async getWeeklyTimesheets(weeks, year, month) {
    this.rowDataset = [];
    this.colDataset = [];
    this.dumptimesheetsList = [];
    this.timesheetsList = [];
    this.columnsOption = [];
    // const rowSum = [];
    // console.log(year + '-' + month + '01');
    const info = {
      'date': year + '-' + month + '-01'
    };

    this._api.getWeeklyTimesheets(info)
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.projects;
          this.dumptimesheetsList = this.response.data;

          console.log(this.projectsList);
          _.map(this.dumptimesheetsList, function (res) {
            // console.log(res.date_week_start);
            res['weekstartdate'] = moment(res.date_week_start).format('YYYY-MM-DD');
            res['weekenddate'] = moment(res.date_week_end).format('YYYY-MM-DD');
          });
          console.log(this.dumptimesheetsList);

          for (let i = 0; i < weeks.length; i++) {
            // console.log(weeks[i]);
            this.colDataset.push(moment(weeks[i].weekstartdate, 'YYYY-MM-DD').format('DD/MM/YY') + ' to '
              + moment(weeks[i].weekenddate, 'YYYY-MM-DD').format('DD/MM/YY'));
          }
          // console.log(this.colDataset);

          for (let j = 0; j < this.projectsList.length; j++) {
            const r = [];
            for (let i = 0; i < weeks.length; i++) {
              // console.log(weeks[i]);
              // // console.log(this.setHoursToTable(this.projectsList[j], weeks[i]));
              const result = this.setHoursToTable(this.projectsList[j], weeks[i]);
              // console.log(result.time);
              // console.log(moment(weeks[i].weekstartdate).format('YYMM'));
              // console.log(moment().format('YYMM'));
              if (moment(weeks[i].weekenddate).format('YYMM') < moment().format('YYMM')) {
                r[i] = result;
              } else if (result.time > 0 &&
                moment(weeks[i].weekenddate).format('YYMM') >= moment().format('YYMM')) {
                r[i] = result;
              } else {
                r[i] = result;
                r[i].time = this.projectsList[j].default_time;
              }

            }
            this.timesheetsList[j] = r;
          }
          // console.log(this.timesheetsList);
          let totalsum = 0; let columnSum = 0; const sum = []; let rowSum = 0; const rowSumResult = [];
          for (let i = 0; i < weeks.length; i++) {
            columnSum = 0;
            for (let j = 0; j < this.projectsList.length; j++) {
              columnSum = columnSum + (this.timesheetsList[j][i] ? Number(this.timesheetsList[j][i].time) : 0);
              this.commentResult.push({
                row: j,
                col: i,
                comment: {
                  value: this.timesheetsList[j][i] ?
                    (this.timesheetsList[j][i].work_done ? this.timesheetsList[j][i].work_done : ' ') : ' ',
                  readOnly: (moment().format('YYYY/MM') !== (year + '/' + month)) ? true : false,
                  project_id: this.projectsList[j].project_id,
                  id: this.timesheetsList[j][i].id,
                  date_week_start: this.timesheetsList[j][i].date_week_start,
                  date_week_end: this.timesheetsList[j][i].date_week_end,
                  user_id: this.userData.user_id
                }
              });
            }
            // this.colDataset.push(i + ' - ' + moment([year, month - 1, i]).format('ddd'));
            totalsum = Number(totalsum) + Number(columnSum);
            sum.push({ time: columnSum });
          }
          this.colDataset.push('Total Hours');
          sum.push({ time: totalsum });


          for (let j = 0; j < this.projectsList.length; j++) {
            rowSum = 0;
            for (let i = 0; i < weeks.length; i++) {
              rowSum = rowSum + (this.timesheetsList[j][i] ? Number(this.timesheetsList[j][i].time) : 0);
            }
            this.timesheetsList[j].push({ time: rowSum });
          }
          this.timesheetsList.push(sum);
          for (let j = 0; j < this.projectsList.length; j++) {
            this.rowDataset.push(this.projectsList[j].project_name);
          }
          this.rowDataset.push('Total Hours');

          for (let i = 0; i <= weeks.length; i++) {
            this.columnsOption.push({
              data: i + '.time',
              type: 'numeric',
              numericFormat: { pattern: '00.00' }
            });
            // rowSum.push({ data: i + '.time', readOnly: true });
          }

          // console.log(this.rowDataset);
          // this.timesheetsList.push([]);

          // const example2 = document.getElementById('example2');
          let tableLoaded = false;

          this.hot2.updateSettings({
            colHeaders: this.colDataset,
            rowHeaders: this.rowDataset,
            data: this.timesheetsList,
            columns: this.columnsOption,
            cell: this.commentResult,
            afterSetCellMeta: (row, col, key, val) => {
              if (tableLoaded) {
                if (key === 'comment') {
                  // Maybe add dirty check
                  // // console.log(val.value);
                  // // console.log(this.timesheetsList[row][col].work_done);
                  if (this.timesheetsList[row][col].work_done !== val.value && val.value !== ' ') {
                    // console.log(val);
                    const dataList = {
                      list: val
                    };
                    this._api.insertWeeklyTimesheetsComments(dataList)
                      .subscribe(
                        result => {
                          this.response = result;
                          if (this.response.success) {
                            // this.alertService.success(data.message);
                            // console.log(result);
                            // console.log(result.data.insertId);
                            this.setComment(row, col, val, this.response.data.insertId);
                            this.timesheetsList[row][col].work_done = val.value;
                            this.timesheetsList[row][col].id = this.response.data.insertId;
                          } else {
                            // this.alertService.warn(data.message);
                          }
                        },
                        error => {
                          // // console.log(error);
                        });
                  }
                }

              }
            },
            afterChange: (change, source) => {
              if (source === 'loadData') {
                tableLoaded = true;
              }
              console.log(change);
              if (change) {
                const row = change[0][0];
                const col = change[0][1].split('.')[0];
                if ((Number(this.timesheetsList[row][col].time_limit_daily)) < Number(change[0][3])) {
                  // this.timesheetsList[row][col].time = this.timesheetsList[row][col].time_limit_daily;
                  // // this.hot2.selectCell(row, prop);
                  // console.log(this.timesheetsList);
                  // // this.hot2.setDataAtCell(row, col, 0);
                  // this.hot2.loadData(this.timesheetsList);
                }
                this.timesheetsList[row][col].time = this.timesheetsList[row][col].time_limit_daily;
                // this.hot2.selectCell(row, prop);
                console.log(this.timesheetsList);
                // this.hot2.setDataAtCell(row, col, 0);
                this.hot2.loadData(this.timesheetsList);
              }

            },
            cells: (row, col, prop) => {
              const cellProperties = {};
              cellProperties['renderer'] = this.applyColorValueRenderer;
              if (row === (this.timesheetsList.length - 1)) {
                cellProperties['readOnly'] = 'true';
              }
              if (col === (this.colDataset.length - 1)) {
                cellProperties['readOnly'] = 'true';
              }
              // if (moment().format('YYYY/MM') !== (year + '/' + month)) {
              //   cellProperties['readOnly'] = 'true';
              // }
              return cellProperties;
            },
            // height: 200,
            // autoColumnSize: true,
            // stretchH: 'all',
            // autoWrapRow: true,
            // type: 'numeric',
            // // colWidths: 70,
            // fillHandle: false,
            // rowHeaderWidth: 180,
            // allowEmpty: true,
            // correctFormat: true
          });

        },
        error => {
          // // console.log(error);
        });

  }

  setComment(row, col, res, id) {
    // console.log(res);
    // console.log(id);
    this.hot2.getCellMeta(row, col).comment = {
      'value': res.value,
      'id': id,
      'project_id': res.project_id,
      'date_week_start': res.date_week_start,
      'date_week_end': res.date_week_end,
      'user_id': res.user_id
    };

  }

  setHoursToTable(project, week) {
    const data = {
      'user_id': this.userData.user_id,
      'project_id': project.project_id,
      'weekstartdate': moment(week.weekstartdate).format('YYYY-MM-DD')
    };
    // console.log(data);
    let res;
    res = _.where(this.dumptimesheetsList, data);
    // console.log(res);
    if (res[0]) {
      res[0]['time_limit_daily'] = project.time_limit_daily;
      res[0]['default_time'] = project.default_time;
      return res[0];
    } else {
      return {
        'user_id': this.userData.user_id,
        'project_id': project.project_id,
        'date_week_start': week.weekstartdate,
        'date_week_end': week.weekenddate,
        'weekstartdate': moment(week.weekstartdate).format('YYYY-MM-DD'),
        'time': '',
        'time_limit_daily': project.time_limit_daily,
        'default_time': project.default_time
      };
    }
  }


  saveData() {
    for (let j = 0; j < this.projectsList.length; j++) {
      this.timesheetsList[j].pop();
    }

    // console.log(this.timesheetsList);
    // this.timesheetsList.slice(0, -1);
    // console.log(this.timesheetsList.slice(0, -1));
    const dataList = {
      list: this.timesheetsList.slice(0, -1)
    };
    // console.log(dataList);
    this._api.insertWeeklyTimesheets(dataList)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.alertService.success(this.response.message);
            const year = moment(this.selectedDate).format('YYYY');
            const month = moment(this.selectedDate).format('MM');

            this.weeks(year + '-' + month + '-01', year, month);
          } else {
            this.alertService.warn(this.response.message);
          }
        },
        error => {
          // // console.log(error);
        });
  }

}
