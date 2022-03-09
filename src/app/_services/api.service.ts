import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// custom settings Import
import { AppSettings } from "../app.settings";
import { Observable, defer, from } from "rxjs";

@Injectable()
export class ApiService {
  livePage: String;
  constructor(private http: HttpClient) {}

  // extract data
  extractData(res: Response): any {
    return res.json() || {};
  }

  // Users Add
  addUser(data) {
    return this.http.post(AppSettings.ADD_USER_API, data);
  }

  // Locations Add
  addLocation(data) {
    return this.http.post(AppSettings.ADD_LOCATION_API, data);
  }

  // Role Add
  addRole(data) {
    return this.http.post(AppSettings.ADD_ROLE_API, data);
  }

  // get location
  getLocations() {
    return this.http.post(AppSettings.GET_LOCATIONS_API, {});
  }

  // get CheckinCkeckoutData
  getCheckinCkeckoutData(data) {
    return this.http.post(AppSettings.GET_CHECKIN_CHECKOUT_DATA_API, data);
  }

  // get Role
  getRoles() {
    return this.http.post(AppSettings.GET_ROLE_API, {});
  }
  // Users Update
  updateUser(data) {
    return this.http.post(AppSettings.UPDATE_USER_API, data);
  }

  // Users Location
  updateLocation(data) {
    return this.http.post(AppSettings.UPDATE_LOCATION_API, data);
  }

  // update location status
  updateLocationStatus(data) {
    return this.http.post(AppSettings.UPDATE_LOCATION_STATUS_API, data);
  }

  deleteProjectAllocationById(data) {
    return this.http.post(AppSettings.DELETE_PROJECT_ALLOCATION_API, data);
  }

  deleteEmployeeAllocationById(data) {
    return this.http.post(AppSettings.DELETE_EMPLOYEE_ALLOCATION_API, data);
  }

  // update role status
  updateRoleStatus(data) {
    return this.http.post(AppSettings.UPDATE_ROLE_STATUS_API, data);
  }

  // update time approval
  updateTimeApprovalStatus(data) {
    return this.http.post(AppSettings.UPDATE_TIME_APPROVAL_STATUS_API, data);
  }

  // update hourly time approval
  updateHourlyTimeApprovalStatus(data) {
    return this.http.post(
      AppSettings.UPDATE_HOURLY_TIME_APPROVAL_STATUS_API,
      data
    );
  }

  // update user status
  updateUserStatus(data) {
    return this.http.post(AppSettings.UPDATE_USER_STATUS_API, data);
  }

  //update Daily time entry status

  updateDailyTimeEntryStatus(data) {
    return this.http.post(
      AppSettings.UPDATE_DAILY_TIME_ENTRY_REQUIRED_STATUS_API,
      data
    );
  }

  // update project status
  updateProjectStatus(data) {
    return this.http.post(AppSettings.UPDATE_PROJECT_STATUS_API, data);
  }

  // update project status
  updateProjectBillableStatus(data) {
    return this.http.post(AppSettings.UPDATE_PROJECT_BillABLE_STATUS_API, data);
  }

  // delete project
  deleteProject(data) {
    return this.http.post(AppSettings.DELETE_PROJECT_API, data);
  }

  // Update Role
  updateRole(data) {
    return this.http.post(AppSettings.UPDATE_ROLE_API, data);
  }

  // list of users
  usersList() {
    return this.http.post(AppSettings.USERS_LIST_API, {});
  }

  //get locktime entry dates(today,first and last dates of current ,previous months)
  getLockTimeEntryDates() {
    return this.http.get(AppSettings.GET_LOCK_TIME_ENTRY_DATES);
  }

  getPreviousMonthMatrixData(value) {
    return this.http.post(AppSettings.GET_PREVIOUSMONTH_MATRIX_DATA, value);
  }

  getCurrentMonthMatrixData(value) {
    return this.http.post(AppSettings.GET_CURRENTMONTH_MATRIX_DATA, value);
  }

  getPreviousMonthEmployeeWorkdoneDetailsOnSpecificProject(value) {
    return this.http.post(
      AppSettings.GET_PreviousMonthEmployeeWorkdoneDetailsOnSpecificProject,
      value
    );
  }

  getCurrentMonthEmployeeWorkdoneDetailsOnSpecificProject(value) {// here in value we pass employee id and project id
    return this.http.post(
      AppSettings.GET_CurrentMonthEmployeeWorkdoneDetailsOnSpecificProject,
      value
    );
  }

  getPreviousMonthTotalEmployeeWorkdoneDetails(value) {// we pass employee id
    return this.http.post(
      AppSettings.GET_PreviousMonthTotalEmployeeWorkdoneDetails,
      value
    );
  }

  getCurrentMonthTotalEmployeeWorkdoneDetails(value) {// we pass employee id
    return this.http.post(
      AppSettings.GET_CurrentMonthTotalEmployeeWorkdoneDetails,
      value
    );
  }


  getPreviousMonthTotalWorkdoneOnProjectDetails(value) {// we pass project id, dailytimeentry required filter value (0/1/2{if both 1 and 2 needed})
    return this.http.post(
      AppSettings.GET_PreviousMonthTotalWorkdoneOnProjectDetails,
      value
    );
  }

  //We are using this Api in viewing the matrix data on clicking of hours
  getCurrentMonthTotalWorkdoneOnProjectDetails(value) {// we pass project id, dailytimeentry required filter value (0/1/2{if both 1 and 2 needed})
    return this.http.post(
      AppSettings.GET_CurrentMonthTotalWorkdoneOnProjectDetails,
      value
    );
  }

  // /api/PreviousMonth_DetailsOfEmployeeWorkDoneOnSpecificProject

  usersDataList() {
    return this.http.post(AppSettings.GET_USERS_DATA_LIST_API, {});
  }

  // List of project manager Employees list
  employeesList() {
    return this.http.post(AppSettings.Employees_LIST_API, {});
  }

  // List of employees list
  getEmployeesList() {
    return this.http.post(AppSettings.GET_EMPLOYEES_LIST_API, {});
  }

  // list of projectManagerEmployees Projects list
  getProjectManagerEmployeesProjectsList() {
    return this.http.post(
      AppSettings.GET_PROJECTMANAGER_EMPLOYEE_PROJECTS_LIST_API,
      {}
    );
  }

  // get employees dailystatus
  getEmployeeDailyStatusforTimeApproval() {
    return this.http.post(
      AppSettings.GET_EMPLOYEES_DAILY_STATUS_FOR_TIME_APPROVAL_API,
      {}
    );
  }

  // get employee time approval status
  getEmployeeDailyTimeApprovalStatus() {
    return this.http.post(
      AppSettings.GET_EMPLOYEE_DAILY_TIME_APPROVAL_STATUS_API,
      {}
    );
  }

  // get employees Hourly Project Time approval
  getEmployeeHourlyProjectTimeApproval() {
    return this.http.post(
      AppSettings.GET_EMPLOYEES_HOURLY_PROJECT_TIME_APPROVAL_API,
      {}
    );
  }

  // get employee hourly time approval status
  getEmployeeHourlyTimeApprovalStatus() {
    return this.http.post(
      AppSettings.GET_EMPLOYEE_HOURLY_TIME_APPROVAL_STATUS_API,
      {}
    );
  }

  // Projects Add
  addProject(data) {
    return this.http.post(
      AppSettings.ADD_PROJECT_WITH_OUT_ATTACHMENT_API,
      data
    );
  }

  addTaskList(data) {
    return this.http.post(AppSettings.INSERT_TASK_DATA_API, data);
  }

  // Projects Update
  updateProject(data) {
    return this.http.post(AppSettings.UPDATE_PROJECT_API, data);
  }

  // list of Projects
  projectsList() {
    return this.http.post(AppSettings.PROJECTS_LIST_API, {});
  }

  getAllProjectsList() {
    return this.http.post(AppSettings.GET_ALL_PROJECTS_LIST_API, {});
  }

  // getAllAdminHourlyProjectsList
  getAllAdminHourlyProjectsList() {
    return this.http.post(
      AppSettings.GET_ALL_ADMIN_HOURLY_PROJECTS_LIST_API,
      {}
    );
  }

  // update Profile
  updateProfile(data) {
    return this.http.post(AppSettings.UPDATE_PROFILE_API, data);
  }

  // update Password
  updatePassword(data) {
    return this.http.post(AppSettings.UPDATE_PASSWORD_API, data);
  }

  // get User By Id
  getUserById(data) {
    return this.http.post(AppSettings.GET_USER_BY_ID_API, data);
  }

  // update Profile Picture
  updateProfilePicture(data) {
    return this.http.post(AppSettings.UPDATE_PROFILE_PICTURE_API, data);
  }

  // get User Project Details
  getUserProjectDetails() {
    return this.http.post(AppSettings.PROJECTS_USERS_LIST_API, {});
  }

  // getEmployeesProjectDetails
  getEmployeesProjectAllocationDetails() {
    return this.http.post(AppSettings.GET_EMPLOYEES_PROJECT_DETAILS_API, {});
  }

  // get project user details
  getProjectUserDetails() {
    return this.http.post(AppSettings.PROJECTS_USERS_DETAILS_LIST_API, {});
  }

  // get Employee Project list details
  getEmployeeProjectsList() {
    return this.http.post(
      AppSettings.GET_EMPLOYEE_PROJECTS_DETAILS_LIST_API,
      {}
    );
  }

  // get employee project details
  getEmployeeProjectDetails(data) {
    return this.http.post(AppSettings.GET_EMPLOYEE_PROJECTDETAILS_API, data);
  }
  // get User Edit Project Details
  getUserEditProjectDetails(data) {
    return this.http.post(AppSettings.PROJECTS_EDIT_USERS_LIST_API, data);
  }

  getEmployeeEditProjects(data) {
    return this.http.post(AppSettings.EMPLOYEE_EDIT_PROJECTS_LIST_API, data);
  }

  // Projects Add
  addProjectAllocation(data) {
    return this.http.post(AppSettings.ADD_PROJECT_ALLOCATION_API, data);
  }

  // addEmployeeAllocation
  addEmployeeAllocation(data) {
    return this.http.post(AppSettings.ADD_EMPLOYEE_ALLOCATION_API, data);
  }

  // Projects Update
  updateProjectAllocation(data) {
    return this.http.post(AppSettings.UPDATE_PROJECT_ALLOCATION_API, data);
  }

  // updateEmployeeAllocation
  updateEmployeeAllocation(data) {
    return this.http.post(AppSettings.UPDATE_EMPLOYEE_ALLOCATION_API, data);
  }

  // list of Projects
  getProjectAllocationsList() {
    return this.http.post(AppSettings.PROJECT_ALLOCATIONS_LIST_API, {});
  }

  // list of employee allocations list
  getEmployeeAllocationsList() {
    return this.http.post(AppSettings.GET_EMPLOYEE_ALLOCATIONS_LIST_API, {});
  }

  getUserProjectAllocations(data) {
    return this.http.post(AppSettings.PROJECT_ALLOCATIONS_DATES_LIST_API, data);
  }

  getEmployeeProjectAllocations(data) {
    return this.http.post(
      AppSettings.GET_EMPLOYEE_PROJECT_ALLOCATIONS_DATES_LIST_API,
      data
    );
  }

  // update Project Allocations Dates
  updateProjectAllocationsDates(data) {
    return this.http.post(
      AppSettings.UPDATE_PROJECT_ALLOCATIONS_DATES_LIST_API,
      data
    );
  }

  // updateEmployeeAllocationDates
  updateEmployeeAllocationDates(data) {
    return this.http.post(
      AppSettings.UPDATE_EMPLOYEE_ALLOCATION_DATES_API,
      data
    );
  }

  // Timesheets Add
  addTimesheet(data) {
    return this.http.post(AppSettings.ADD_TIMESHEET_API, data);
  }

  // Timesheets Update
  updateTimesheet(data) {
    return this.http.post(AppSettings.UPDATE_TIMESHEET_API, data);
  }

  // update Drag Drop Timesheet
  updateDragDropTimesheet(data) {
    return this.http.post(AppSettings.UPDATE_DRAG_DROP_TIMESHEET_API, data);
  }

  // list of Timesheets
  getTimesheetsList(data) {
    return this.http.post(AppSettings.TIMESHEETS_LIST_API, data);
  }

  // get User Projects List
  getUserProjectsList(data) {
    return this.http.post(AppSettings.GET_USER_PROJECTS_LIST_API, data);
  }

  // getUserProjectsListData(data) {
  //   return this.http.post(AppSettings.GET_USER_PROJECTS_LIST_DATA_API, data);
  // }

  // get DailyStatus Projects List
  getDailyStatusProjectsList(data) {
    return this.http.post(AppSettings.GET_DAILY_STATUS_PROJECTS_LIST_API, data);
  }

  // get projectmanager projects list
  getProjectManagerProjectsList(data) {
    return this.http.post(
      AppSettings.GET_PROJECTMANAGER_PROJECTS_LIST_API,
      data
    );
  }

  // get projectmanager employees list
  getprojectManagerusersList(data) {
    return this.http.post(
      AppSettings.GET_PROJECTMANAGER_EMPLOYEES_LIST_API,
      data
    );
  }
  // get employee projects list
  getEmployeeProjectList(data) {
    return this.http.post(AppSettings.GET_EMPLOYEE_PROJECTS_LIST_API, data);
  }

  // get user time limit data
  getUserTimeLimitData(data) {
    return this.http.post(AppSettings.GET_USER_TIME_LIMIT_DATA_API, data);
  }

  // get User Update Project Details
  getUserUpdateProjectDetails(data) {
    return this.http.post(AppSettings.GET_USER_ALL_PROJECTS_LIST_API, data);
  }

  // get Previous 30 Days Report
  getUserTimesheetReports(data) {
    return this.http.post(AppSettings.GET_USER_TIMESHEET_REPORTS_API, data);
  }

  // get User Projects Count Dashboard
  getUsersCountsDashboard(data) {
    return this.http.post(AppSettings.GET_USER_COUNTS_DASHBOARD_API, data);
  }

  //get getHoursWorkedDelayLastTimeentryReport
  getHoursWorkedDelayLastTimeentryReport() {
    return this.http.get(
      AppSettings.GET_HOURSWORKED_DELAY_LASTTIME_ENTRY_CURRENT_PREVIOUS_MONTHS_API
    );
  }

  // get projects count dashboard
  getProjectManagerProjectsCountDashboard(data) {
    return this.http.post(
      AppSettings.GET_PROJECTMANAGER_PROJECTS_COUNT_DASHBOARD_API,
      data
    );
  }

  // get Admin Projects Count Dashboard
  getAdminCountsDashboard() {
    return this.http.post(AppSettings.GET_ADMIN_COUNTS_DASHBOARD_API, {});
  }

  // clients List
  clientsList() {
    return this.http.post(AppSettings.GET_CLIENTS_LISt_API, {});
  }

  // get all timesheets
  getTimesheets(data) {
    return this.http.post(AppSettings.GET_TIMESHEETS_LIST_API, data);
  }

  // get Daily timesheets
  getDailyTimesheets(data) {
    return this.http.post(AppSettings.GET_DAILY_TIMESHEETS_LIST_API, data);
  }

  // get Daily Insert timesheets
  insertDailyTimesheets(data) {
    return this.http.post(AppSettings.INSERT_DAILY_TIMESHEETS_LIST_API, data);
  }

  // get Daily Insert timesheets comments
  insertDailyTimesheetsComments(data) {
    return this.http.post(
      AppSettings.INSERT_DAILY_TIMESHEETS_LIST_COMMENTS_API,
      data
    );
  }

  // get Weekly timesheets
  getWeeklyTimesheets(data) {
    return this.http.post(AppSettings.GET_WEEKLY_TIMESHEETS_LIST_API, data);
  }

  // get Weekly Insert timesheets
  insertWeeklyTimesheets(data) {
    return this.http.post(AppSettings.INSERT_WEEKLY_TIMESHEETS_LIST_API, data);
  }

  // get Daily Insert timesheets comments
  insertWeeklyTimesheetsComments(data) {
    return this.http.post(
      AppSettings.INSERT_WEEKLY_TIMESHEETS_LIST_COMMENTS_API,
      data
    );
  }

  // get Monthly timesheets
  getMonthlyTimesheets(data) {
    return this.http.post(AppSettings.GET_MONTHLY_TIMESHEETS_LIST_API, data);
  }

  // get Monthly Insert timesheets
  insertMonthlyTimesheets(data) {
    return this.http.post(AppSettings.INSERT_MONTHLY_TIMESHEETS_LIST_API, data);
  }

  // get Monthly Insert timesheets comments
  insertMonthlyTimesheetsComments(data) {
    return this.http.post(
      AppSettings.INSERT_MONTHLY_TIMESHEETS_LIST_COMMENTS_API,
      data
    );
  }

  // add or update daily status
  addOrUpdateDailyStatus(data) {
    return this.http.post(AppSettings.ADD_OR_UPDATE_DAILY_STATUS_API, data);
  }

  // add checkin time
  addCheckInTime(data) {
    return this.http.post(AppSettings.ADD_CHECK_IN_TIME_API, data);
  }

  // add Hourly time
  saveHourlyTime(data) {
    return this.http.post(AppSettings.SAVE_HOURLY_TIME_API, data);
  }

  // insertHourlyTime
  insertHourlyTime(data) {
    return this.http.post(AppSettings.INSERT_HOURLY_TIME_API, data);
  }

  getDailyStatus(): Observable<any> {
    return this.http.get<any>(AppSettings.GET_EMPLOYEE_MONTHLY_REPORT_API);
  }

  getDetailReport(): Observable<any> {
    return this.http.get<any>(AppSettings.GET_PROJECT_REPORT_API);
  }

  getSummaryReport(): Observable<any> {
    return this.http.get<any>(AppSettings.GET_PROJECTDETAIL_REPORT_API);
  }

  CurrentProjectSummaryReport(): Observable<any> {
    return this.http.get<any>(
      AppSettings.GET_CURRENT_PROJECT_SUMMARY_REPORT_API
    );
  }

  CurrentProjectDetailReport(): Observable<any> {
    return this.http.get<any>(
      AppSettings.GET_CURRENT_PROJECT_DETAIL_REPORT_API
    );
  }

  getNonCompliantReportPreviousMonth(): Observable<any> {
    return this.http.get<any>(
      AppSettings.GET_PREVIOUS_MONTH_NON_COMPLIANT_REPORT_API
    );
  }

  getNonCompliantReportCurrentMonth(): Observable<any> {
    return this.http.get<any>(
      AppSettings.GET_CURRENT_MONTH_NON_COMPLIANT_REPORT_API
    );
  }

  getUserReport(): Observable<any> {
    return this.http.get<any>(AppSettings.GET_USER_REPORT_API);
  }

  getUserReportCurrentMonth(): Observable<any> {
    return this.http.get<any>(AppSettings.GET_USER_REPORT_CURRENT_API);
  }

  getAdminDashboardReport(days): Observable<any> {
    return this.http.post<any>(
      AppSettings.GET_ADMIN_DASHBOARD_REPORT_API,
      days
    );
  }

  getAdminDashboardListAll(days): Observable<any> {
    return this.http.post<any>(
      AppSettings.GET_ADMIN_DASHBOARD_LIST_ALL_API,
      days
    );
  }

  getAdminDashboardDelayReport(): Observable<any> {
    return this.http.get<any>(AppSettings.GET_ADMIN_DASHBOARD_DELAY_REPORT_API);
  }

  // updateHourlyTimesheet
  updateHourlyTimesheet(data) {
    return this.http.post(AppSettings.UPDATE_HOURLY_TIME_SHEET_API, data);
  }

  // update Hourly time
  updateHourlyTime(data) {
    return this.http.post(AppSettings.UPDATE_HOURLY_TIME_API, data);
  }

  // update checkout time
  updateCheckoutTime(data) {
    return this.http.post(AppSettings.UPDATE_CHECK_OUT_TIME_API, data);
  }

  // daily_status by date
  getDailyStatusByDate(data) {
    return this.http.post(AppSettings.GET_DAILY_STATUS_BY_DATE_API, data);
  }

  getHourlyTimeSheetData(data) {
    return this.http.post(AppSettings.GET_HOURLY_TIMESHEET_DATA_API, data);
  }

  // delete daily status
  deleteDailyStatusById(data) {
    return this.http.post(AppSettings.DELETE_DAILY_STATUS_BY_ID_API, data);
  }

  // delete hourly status
  deleteHourlyStatusById(data) {
    return this.http.post(AppSettings.DELETE_HOURLY_STATUS_BY_ID_API, data);
  }

  // getAdminDailyStatus
  getAdminDailyStatus(data) {
    return this.http.post(AppSettings.GET_ADMIN_DAILY_STATUS_API, data);
  }

  // getAdminHourly status
  getAdminHourlyStatus(data) {
    return this.http.post(AppSettings.GET_ADMIN_HOURLY_STATUS_API, data);
  }
  // getProjectManagerDailyStatus
  getProjectManagerDailyStatus(data) {
    return this.http.post(
      AppSettings.GET_PROJECT_MANAGER_DAILY_STATUS_API,
      data
    );
  }

  // get Previous 30 Days Report
  getUserHoursReport(data) {
    console.log("data", data);
    return this.http.post(AppSettings.GET_USERS_HOURS_REPORT_API, data);
  }
}
