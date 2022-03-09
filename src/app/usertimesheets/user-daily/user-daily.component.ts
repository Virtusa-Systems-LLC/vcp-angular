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
  selector: 'app-user-daily',
  templateUrl: './user-daily.component.html',
  styleUrls: ['./user-daily.component.css']
})
export class UserDailyComponent implements OnInit, AfterViewInit {

  projectsList = [];

  userData: any;

  colDataset = [];
  rowDataset = [];
  columnsOption = [];

  dataset: any[];

  timesheetsList = [];
  commentResult = [];

  _currentDateView: any;
  hot2: any;
  container: any;
  resultListData = [];
  selectedDate: any;

  response: any;
  constructor(public _api: ApiService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.getMonthDateRange(moment().format('YYYY'), moment().format('MM'), moment().format('YYYY-MM-01'));
    this._currentDateView = moment().format('YYYY/MM/DD');

  }

  ngAfterViewInit() {
    this.container = document.getElementById('example2');

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
    //   colWidths: 70,
    //   fillHandle: false,
    //   rowHeaderWidth: 180,
    //   allowEmpty: true,
    //   // fixedColumnsLeft: (this.timesheetsList[0].length - 1),
    //   correctFormat: true,
    //   comments: true
    // });

  }

  getMonthDateRange(year, month, date) {

    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    const startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    const endDate = moment(startDate).endOf('month').format('D');

    // just for demonstration:
    console.log(moment(startDate).format('D'));
    console.log(endDate);

    // make sure to call toDate() for plain JavaScript date type
    // return { start: moment(startDate).format('D'), end: endDate };

    // this.initTracker(moment(startDate).format('D'), endDate, month, year, date);
    this.getDailyTimesheets(date, year, month, moment(startDate).format('D'), endDate);
  }

  selectedMonth(event) {
    console.log(event);
    const year = moment(event.date).format('YYYY');
    const month = moment(event.date).format('MM');
    const startDate = moment([year, Number(month) - 1]);

    // Clone the value before .endOf()
    const endDate = moment(startDate).endOf('month').format('D');
    // this.hot2.render();
    this.getDailyTimesheets(event.date, year, month, moment(startDate).format('D'), endDate);
  }


  async getDailyTimesheets(date, year, month, start, end) {
    this.rowDataset = [];
    this.colDataset = [];
    this.timesheetsList = [];
    this.columnsOption = [];
    this.projectsList = [];
    this.commentResult = [];
    const info = {
      'date': moment(date).format('YYYY-MM-DD')
    };
    console.log(info);
    await this._api.getDailyTimesheets(info)
      .subscribe(
        data => {
          this.response = data;
          this.projectsList = this.response.projects;
          this.timesheetsList = this.response.data;

          for (let j = 0; j < this.projectsList.length; j++) {
            _.map(this.timesheetsList[j], (res) => {
              // console.log(res.date);
              res['day1'] = moment(res.date).format('YYYY-MM-DD');
            });
          }

          console.log(this.timesheetsList);

          for (let j = 0; j < this.projectsList.length; j++) {
            this.rowDataset.push(this.projectsList[j].project_name);
          }
          this.rowDataset.push('Total Hours');

          let totalsum = 0; let columnSum = 0; const sum = []; let rowSum = 0; const rowSumResult = [];
          for (let i = Number(start); i <= Number(end); i++) {
            columnSum = 0;
            for (let j = 0; j < this.projectsList.length; j++) {
              columnSum = columnSum + this.getColumnWiseHours(this.projectsList[j], moment([year, month - 1, i]).format('YYYY-MM-DD'), j);
              this.commentResult.push({
                row: j,
                col: i - 1,
                comment: {
                  value: this.timesheetsList[j][i - 1] ?
                    (this.timesheetsList[j][i - 1].work_done ? this.timesheetsList[j][i - 1].work_done : ' ') : ' ',
                  // readOnly: (moment().format('YYYY/MM') !== (year + '/' + month)) ? true : false,
                  // readOnly: ((moment(this.projectsList[j].end_date, 'YYYY-MM-DD').format('YYYY-MM-DD') >
                  //   moment(year + '-' + month + '-' + i).format('YYYY-MM-DD')) &&
                  //   (moment().format('YYYY/MM') === (year + '/' + month))) ? false : true,
                  project_id: this.projectsList[j].project_id,
                  id: this.timesheetsList[j][i - 1].id,
                  date: this.timesheetsList[j][i - 1].date,
                  user_id: this.userData.user_id
                }
              });
            }
            this.colDataset.push(i + ' - ' + moment([year, month - 1, i]).format('ddd'));
            totalsum = totalsum + columnSum;
            sum.push({ time: columnSum });
            // this.columnsOption.push(columnSum);
          }
          this.colDataset.push('Total Hours');
          sum.push({ time: totalsum });
          for (let j = 0; j < this.projectsList.length; j++) {
            rowSum = 0;
            for (let i = 1; i <= Number(end); i++) {
              rowSum = rowSum + this.getColumnWiseHours(this.projectsList[j], moment([year, month - 1, i]).format('YYYY-MM-DD'), j);
            }
            this.timesheetsList[j].push({ time: rowSum });
            // this.columnsOption.push(columnSum);
          }
          // console.log(sum);
          // console.log(commentsResult);
          this.timesheetsList.push(sum);

          for (let i = 0; i <= Number(end); i++) {

            this.columnsOption.push({
              data: i + '.time',
              type: 'numeric',
              numericFormat: { pattern: '00.00' },
              // allowInvalid: false
            });
          }
          let tableLoaded = false;
          console.log(this.colDataset);

          console.log(this.timesheetsList);
          // const example2 = document.getElementById('example2');
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
                  // console.log(val.value);
                  console.log(this.timesheetsList[row][col].work_done);
                  if (this.timesheetsList[row][col].work_done !== val.value && val.value !== ' ') {
                    console.log(val);
                    const dataList = {
                      list: val
                    };
                    this._api.insertDailyTimesheetsComments(dataList)
                      .subscribe(
                        result => {
                          this.response = result;
                          if (this.response.success) {
                            // this.alertService.success(data.message);
                            // console.log(result);
                            console.log(this.response.data.insertId);
                            this.setComment(row, col, val, this.response.data.insertId);
                            this.timesheetsList[row][col].work_done = val.value;
                            this.timesheetsList[row][col].id = this.response.data.insertId;
                          } else {
                            // this.alertService.warn(data.message);
                          }
                        },
                        error => {
                          // console.log(error);
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
                  this.timesheetsList[row][col].time = this.timesheetsList[row][col].time_limit_daily;
                  // this.hot2.selectCell(row, prop);
                  console.log(this.timesheetsList);
                  // this.hot2.setDataAtCell(row, col, 0);
                  this.hot2.loadData(this.timesheetsList);
                }

              }

            },
            cells: (row, col, prop) => {
              const cellProperties = {};
              cellProperties['renderer'] = this.applyColorValueRenderer;
              // this.timesheetsList[row][col] = this.timesheetsList[row][col] > 0 ? this.timesheetsList[row][col] :
              if (row === (this.timesheetsList.length - 1)) {
                cellProperties['readOnly'] = 'true';
              }
              if (col === (this.colDataset.length - 1)) {
                cellProperties['readOnly'] = 'true';
              }
              // let data = this.hot2.getData();
              // if (row < this.timesheetsList.length - 2) {
              //   console.log(row); console.log(this.timesheetsList.length - 2);
              //   data[row][col] = (Number(data[row][col]) > 0 ?
              //     Number(data[row][col]) : Number(this.timesheetsList[row][col].time_limit_daily));
              // }
              // data[row][col] = (Number(data[row][col]) > 0 ?
              //   Number(data[row][col]) : Number(this.timesheetsList[row][col].time_limit_daily));
              // console.log(this.timesheetsList[row][col]['time_limit_daily']);
              // if (moment().format('YYYY/MM') > moment(year + '/' + month + '-01', 'YYYY/MM/DD').format('YYYY/MM')) {
              //   cellProperties['readOnly'] = 'true';
              // }
              return cellProperties;
            }
          });
        },
        error => {
          // console.log(error);
        });

  }

  applyColorValueRenderer(instance, td, row, col, prop, value, cellProperties) {
    // console.log(data);
    // Handsontable.renderers.TextRenderer.apply(this, arguments);

    if (value >= 0) {
      td.style.color = 'green';
      // td.style.background = '#CEC';
    } else if (value < 0) {
      td.style.color = 'red';
      // td.style.background = '#CEC';
    }

    if (isNaN(value)) {
      td.style.background = '#CEC';
    } else {
      // this.alertService.clear();
      td.style.background = '#fff';
    }
    // console.log(data[row][col]);

    // const data = this.hot2.getData();

    // if ((Number(data[row][col].time_limit_daily) ? Number(data[row][col].time_limit_daily) : 0) < value) {
    //   data[row][col] = 0;
    // }

    if (!value || value === '') {
      // td.style.background = '#EEE';
    }
  }

  setComment(row, col, res, id) {
    console.log(res);
    console.log(id);
    this.hot2.getCellMeta(row, col).comment = {
      'value': res.value,
      'id': id,
      'project_id': res.project_id,
      'date': res.date,
      'user_id': res.user_id
    };

  }

  getColumnWiseHours(project, date, index) {
    const data = {
      'user_id': this.userData.user_id,
      'project_id': project.project_id,
      'day1': date
    };
    console.log(data);
    console.log(this.timesheetsList);
    let res;
    res = _.where(this.timesheetsList[index], data);
    console.log(res);
    if (res[0]) {
      return res[0].time;
    } else {
      return 0;
    }
  }

  saveData() {

    for (let j = 0; j < this.projectsList.length; j++) {
      this.timesheetsList[j].pop();
    }

    console.log(this.timesheetsList);
    // this.timesheetsList.slice(0, -1);
    const dataList = {
      list: this.timesheetsList.slice(0, -1)
    };
    console.log(dataList);
    this._api.insertDailyTimesheets(dataList)
      .subscribe(
        data => {
          this.response = data;
          if (this.response.success) {
            this.alertService.success(this.response.message);
            const year = moment(this.selectedDate).format('YYYY');
            const month = moment(this.selectedDate).format('MM');
            const startDate = moment([year, Number(month) - 1]);

            // Clone the value before .endOf()
            const endDate = moment(startDate).endOf('month').format('D');

            this.getDailyTimesheets(year + '-' + month + '- 01', year, month, moment(startDate).format('D'), endDate);

          } else {
            this.alertService.warn(this.response.message);
          }
        },
        error => {
          // console.log(error);
        });
  }

}
