import { environment } from '../environments/environment';
export class AppSettings {

    // Live Url
    public static Url = 'http://localhost:3000/';

    public static role = [
        { 'type': 1, 'name': 'Super Admin' },
        { 'type': 2, 'name': 'Admin' },
        { 'type': 3, 'name': 'Project Manager' },
        { 'type': 4, 'name': 'Employee' },
        { 'type': 5, 'name': 'Contractor' }
    ];

    public static location = [
        { 'type': 0, 'name': 'Suchitra' },
        { 'type': 1, 'name': 'Madhapur' },
        { 'type': 2, 'name': 'Remote' }
    ];

    public static projectType = [
        { 'type': 0, 'name': 'Daily' },
        { 'type': 1, 'name': 'Weekly' },
        { 'type': 2, 'name': 'Monthly' },
        { 'type': 3, 'name': 'Hourly'}
    ];

    public static status = [
        { 'type': 1, 'name': 'Active' },
        { 'type': 0, 'name': 'In Active' },
        { 'type': 2, 'name': 'In Progress' },
        { 'type': 3, 'name': 'Completed' }
    ];

    public static projectStatus = [
        { 'type': 0, 'name': 'Created' },
        { 'type': 1, 'name': 'In Active' },
        { 'type': 2, 'name': 'In Progress' },
        { 'type': 3, 'name': 'Completed' }
    ];

    // API Services Calls

    // login and reset password details
    public static LOGIN_FORM_API = environment.apiUrl + 'login';
    public static RESET_PASSWORD_API = environment.apiUrl + 'restPassword';

    // user profile updation
    public static UPDATE_PASSWORD_API = environment.apiUrl + 'updatePassword';
    public static UPDATE_PROFILE_API = environment.apiUrl + 'updateUserProfile';
    public static UPDATE_PROFILE_PICTURE_API = environment.apiUrl + 'updateUserProfilePicture';

    // user creation details
    public static ADD_USER_API = environment.apiUrl + 'insertUser';
    public static UPDATE_USER_API = environment.apiUrl + 'updateUser';
    public static USERS_LIST_API = environment.apiUrl + 'getAllUsers';
    public static GET_USERS_DATA_LIST_API = environment.apiUrl + 'getUsersDataList';
    public static GET_USER_BY_ID_API = environment.apiUrl + 'getUserById';

    public static Employees_LIST_API = environment.apiUrl + 'getEmployeesList';
    public static GET_EMPLOYEES_LIST_API = environment.apiUrl + 'getAllEmployeesList';
    public static GET_PROJECTMANAGER_EMPLOYEE_PROJECTS_LIST_API = environment.apiUrl + 'getProjectManagerEmployeeProjectsList';

    // get employee daily status
    public static GET_EMPLOYEES_DAILY_STATUS_FOR_TIME_APPROVAL_API = environment.apiUrl + 'getEmployeesDailyStatusforTimeApproval';

    public static GET_EMPLOYEE_DAILY_TIME_APPROVAL_STATUS_API = environment.apiUrl + 'getEmployeeTimeApprovalStatus';

    // get hourly project time approval
    public static GET_EMPLOYEES_HOURLY_PROJECT_TIME_APPROVAL_API = environment.apiUrl + 'getEmployeesHourlyProjectTimeApproval';
    public static GET_EMPLOYEE_HOURLY_TIME_APPROVAL_STATUS_API = environment.apiUrl + 'getEmployeeHourlyTimeApprovalStatus';



    // Location details
    public static ADD_LOCATION_API = environment.apiUrl + 'insertLocation';
    public static UPDATE_LOCATION_API = environment.apiUrl + 'updateLocation';
    public static GET_LOCATIONS_API = environment.apiUrl + 'getAllLocations';

    public static UPDATE_LOCATION_STATUS_API = environment.apiUrl + 'updateLocationStatus';

    public static UPDATE_ROLE_STATUS_API = environment.apiUrl + 'updateRoleStatus';
    public static UPDATE_TIME_APPROVAL_STATUS_API = environment.apiUrl + 'updateTimeApprovalStatus';
    public static UPDATE_HOURLY_TIME_APPROVAL_STATUS_API = environment.apiUrl + 'updateHourlyTimeApprovalStatus';

    public static UPDATE_USER_STATUS_API = environment.apiUrl + 'updateUserStatus';

    public static UPDATE_PROJECT_STATUS_API = environment.apiUrl + 'updateProjectStatus';

    public static UPDATE_PROJECT_BillABLE_STATUS_API = environment.apiUrl + 'updateProjectBillableStatus';


    public static DELETE_PROJECT_ALLOCATION_API = environment.apiUrl + 'deleteProjectAllocation';
    public static DELETE_EMPLOYEE_ALLOCATION_API = environment.apiUrl + 'deleteAllocationofEmployee';
    public static DELETE_PROJECT_API = environment.apiUrl + 'deleteProject';

    // Role details
    public static ADD_ROLE_API = environment.apiUrl + 'insertRole';
    public static UPDATE_ROLE_API = environment.apiUrl + 'updateRole';
    public static GET_ROLE_API = environment.apiUrl + 'getAllRole';

    public static INSERT_TASK_DATA_API = environment.apiUrl + 'insertTaskList';

    // project creation details
    public static ADD_PROJECT_WITH_ATTACHMENT_API = environment.apiUrl + 'insertProjectWithAttachment';
    public static ADD_PROJECT_WITH_OUT_ATTACHMENT_API = environment.apiUrl + 'insertProjectWithOutAttachment';
    public static UPDATE_PROJECT_API = environment.apiUrl + 'updateProject';
    public static PROJECTS_LIST_API = environment.apiUrl + 'getAllProjects';
    public static GET_ALL_PROJECTS_LIST_API = environment.apiUrl + 'getAllProjectsList';
    public static GET_ALL_ADMIN_HOURLY_PROJECTS_LIST_API = environment.apiUrl + 'getAllAdminHourlyProjectsList';

    // Daily Status creation details
    public static ADD_OR_UPDATE_DAILY_STATUS_API = environment.apiUrl + 'insertOrUpdateUserDailyStatus';
    public static UPDATE_DAILY_STATUS_API = environment.apiUrl + 'updateDailyStatusInformation';
    public static GET_DAILY_STATUS_BY_DATE_API = environment.apiUrl + 'getDailyStatusByDate';
    public static DELETE_DAILY_STATUS_BY_ID_API = environment.apiUrl + 'deleteDailyStatusById';
    public static GET_ADMIN_DAILY_STATUS_API = environment.apiUrl + 'getAdminDailyStatus';
    public static GET_ADMIN_HOURLY_STATUS_API = environment.apiUrl + 'getAdminHourlyStatus';
    public static GET_PROJECT_MANAGER_DAILY_STATUS_API = environment.apiUrl + 'getProjectManagerDailyStatus';

    public static GET_HOURLY_TIMESHEET_DATA_API = environment.apiUrl + 'getHourlyTimeSheetData';
    public static DELETE_HOURLY_STATUS_BY_ID_API = environment.apiUrl + 'deleteHourlyStatusById';

    // Add check in time and checkout time
    public static ADD_CHECK_IN_TIME_API = environment.apiUrl + 'insertCheckinTime';
    public static UPDATE_CHECK_OUT_TIME_API = environment.apiUrl + 'insertCheckoutTime';
    public static GET_CHECKIN_CHECKOUT_DATA_API = environment.apiUrl + 'getCheckinCheckoutData';

    public static SAVE_HOURLY_TIME_API = environment.apiUrl + 'saveHourlyTime';
    public static UPDATE_HOURLY_TIME_API = environment.apiUrl + 'updateHourlyTime';
    public static INSERT_HOURLY_TIME_API = environment.apiUrl + 'insertHourlyTime';
    public static UPDATE_HOURLY_TIME_SHEET_API = environment.apiUrl + 'updateHourlyTimesheet';

    // Get user projects details
    public static GET_USER_PROJECTS_LIST_API = environment.apiUrl + 'getUserProjectsList';
    public static GET_EMPLOYEE_MONTHLY_REPORT_API = environment.apiUrl + 'getDailyStatus';
    public static GET_PROJECT_REPORT_API = environment.apiUrl + 'previousmonth_noncompliancereport';
    public static GET_PROJECTDETAIL_REPORT_API = environment.apiUrl + 'projectpreviousmonth_summaryreport';
    public static GET_USER_REPORT_API = environment.apiUrl + 'previousmonth_compliancereportExcludedTimeOff';
    public static GET_USER_REPORT_CURRENT_API = environment.apiUrl + 'currentmonth_compliancereportExcludedTimeOff';
    public static GET_ADMIN_DASHBOARD_REPORT_API = environment.apiUrl + 'getadmin_dashboardreport';
    public static GET_ADMIN_DASHBOARD_LIST_ALL_API = environment.apiUrl + 'getadmin_dashboardlistall';
    public static GET_ADMIN_DASHBOARD_DELAY_REPORT_API = environment.apiUrl + 'getadmin_dashboard_delayreport';
    public static GET_CURRENT_PROJECT_SUMMARY_REPORT_API = environment.apiUrl + 'currentmonth_projectsummaryreport';
    public static GET_CURRENT_PROJECT_DETAIL_REPORT_API = environment.apiUrl + 'currentmonth_projectdetailreport';




    // public static GET_USER_PROJECTS_LIST_DATA_API = environment.apiUrl + 'getUserProjectsListData';
    public static GET_USER_UPDATED_PROJECTS_LIST_API = environment.apiUrl + 'getUserUpdatedProjectsList1';
    public static GET_USER_ALL_PROJECTS_LIST_API = environment.apiUrl + 'getUserAllProjectsList';
    public static GET_DAILY_STATUS_PROJECTS_LIST_API = environment.apiUrl + 'getDailyStatusProjectsList';

    // Get projectManager projects details
    public static GET_PROJECTMANAGER_PROJECTS_LIST_API = environment.apiUrl + 'getProjectManagerProjectsList';

    // Get projectManager employees details
    public static GET_PROJECTMANAGER_EMPLOYEES_LIST_API = environment.apiUrl + 'getProjectManagerEmployeesList';
    public static GET_USER_TIME_LIMIT_DATA_API = environment.apiUrl + 'getUserTimelimitData';

    public static GET_EMPLOYEE_PROJECTS_LIST_API = environment.apiUrl + 'getEmployeeProjectsList';

    public static PROJECTS_USERS_LIST_API = environment.apiUrl + 'getUserProjectDetails';
    public static GET_EMPLOYEES_PROJECT_DETAILS_API = environment.apiUrl + 'getEmployeesProjectDetails';
    public static PROJECTS_EDIT_USERS_LIST_API = environment.apiUrl + 'findUnAllocatedProjectsDetails';
    public static EMPLOYEE_EDIT_PROJECTS_LIST_API = environment.apiUrl + 'findUnAllocatedEmployeesDetails';

    public static PROJECTS_USERS_DETAILS_LIST_API = environment.apiUrl + 'getProjectUserDetails';

    public static GET_EMPLOYEE_PROJECTS_DETAILS_LIST_API = environment.apiUrl + 'getEmployeeProjectsDetailsList';

    public static GET_EMPLOYEE_PROJECTDETAILS_API = environment.apiUrl + 'getEmployeeProjectDetails';

    public static ADD_PROJECT_ALLOCATION_API = environment.apiUrl + 'insertProjectAllocationDeatils';
    public static ADD_EMPLOYEE_ALLOCATION_API = environment.apiUrl + 'insertEmployeeAllocationDetails';
    public static UPDATE_PROJECT_ALLOCATION_API = environment.apiUrl + 'updateProjectAllocation';
    public static UPDATE_EMPLOYEE_ALLOCATION_API = environment.apiUrl + 'updateEmployeeAllocation';
    public static PROJECT_ALLOCATIONS_LIST_API = environment.apiUrl + 'getAllProjectAllocations';
    public static PROJECT_ALLOCATIONS_DATES_LIST_API = environment.apiUrl + 'getAllProjectAllocationsDates';
    public static GET_EMPLOYEE_PROJECT_ALLOCATIONS_DATES_LIST_API = environment.apiUrl + 'getEmployeeProjectAllocationsDates';
    public static UPDATE_PROJECT_ALLOCATIONS_DATES_LIST_API = environment.apiUrl + 'updateProjectAllocationsDates';
    public static UPDATE_EMPLOYEE_ALLOCATION_DATES_API = environment.apiUrl + 'updateEmployeeAllocationsDates';
    public static GET_EMPLOYEE_ALLOCATIONS_LIST_API = environment.apiUrl + 'getEmployeeAllocationsList';

    public static ADD_TIMESHEET_API = environment.apiUrl + 'insertTimesheet';
    public static UPDATE_TIMESHEET_API = environment.apiUrl + 'updateTimesheet';
    public static UPDATE_DRAG_DROP_TIMESHEET_API = environment.apiUrl + 'updateDragDropTimesheet';
    public static TIMESHEETS_LIST_API = environment.apiUrl + 'getAllTimesheets';

    public static GET_USER_TIMESHEET_REPORTS_API = environment.apiUrl + 'getUserTimesheetTypeReports';
    public static GET_USER_COUNTS_DASHBOARD_API = environment.apiUrl + 'getUsersCountsDashboard';
    public static GET_ADMIN_COUNTS_DASHBOARD_API = environment.apiUrl + 'getAdminCountsDashboard';

    public static GET_PROJECTMANAGER_PROJECTS_COUNT_DASHBOARD_API = environment.apiUrl + 'getprojectManagerCountDashboard';

    public static UPDATE_DAILY_TIME_ENTRY_REQUIRED_STATUS_API = environment.apiUrl + 'updateDailyTimeEntryRequiredStatus';

    public static GET_CLIENTS_LISt_API = environment.apiUrl + 'getClientsList';

    public static GET_TIMESHEETS_LIST_API = environment.apiUrl + 'getAllTimesheets';

    public static GET_DAILY_TIMESHEETS_LIST_API = environment.apiUrl + 'getDailyTimesheets';
    public static INSERT_DAILY_TIMESHEETS_LIST_API = environment.apiUrl + 'insertDailyTimesheet';
    public static INSERT_DAILY_TIMESHEETS_LIST_COMMENTS_API = environment.apiUrl + 'insertDailyTimesheetComments';

    public static GET_WEEKLY_TIMESHEETS_LIST_API = environment.apiUrl + 'getWeeklyTimesheets';
    public static INSERT_WEEKLY_TIMESHEETS_LIST_API = environment.apiUrl + 'insertWeeklyTimesheet';
    public static INSERT_WEEKLY_TIMESHEETS_LIST_COMMENTS_API = environment.apiUrl + 'insertWeeklyTimesheetComments';

    public static GET_MONTHLY_TIMESHEETS_LIST_API = environment.apiUrl + 'getMonthlyTimesheets';
    public static INSERT_MONTHLY_TIMESHEETS_LIST_API = environment.apiUrl + 'insertMonthlyTimesheet';
    public static INSERT_MONTHLY_TIMESHEETS_LIST_COMMENTS_API = environment.apiUrl + 'insertMonthlyTimesheetComments';

    public static GET_USERS_HOURS_REPORT_API = environment.apiUrl + 'getUserHoursReport';


    public static GET_PREVIOUS_MONTH_NON_COMPLIANT_REPORT_API = environment.apiUrl + 'previousmonth_noncompliancereport';

    public static GET_CURRENT_MONTH_NON_COMPLIANT_REPORT_API = environment.apiUrl + 'currentmonth_noncompliancereport';

    public static GET_HOURSWORKED_DELAY_LASTTIME_ENTRY_CURRENT_PREVIOUS_MONTHS_API = environment.apiUrl + 'currentandPreviousMonths_HoursWorked_Delay_LasttimeentryReports';


    public static GET_LOCK_TIME_ENTRY_DATES = environment.apiUrl +'getDatesforLockTimeEntry';



    //matrix data fetching

    public static GET_PREVIOUSMONTH_MATRIX_DATA = environment.apiUrl + 'projectsEmployees_Matrix_previousmonth';

    public static GET_CURRENTMONTH_MATRIX_DATA  = environment.apiUrl + 'projectsEmployees_Matrix_currentmonth';


    //Displaying Clicked data of matrix in new Page

    public static GET_PreviousMonthEmployeeWorkdoneDetailsOnSpecificProject  = environment.apiUrl +  'previousMonth_DetailsOfEmployeeWorkDoneOnSpecificProject' ; 
    
    public static GET_CurrentMonthEmployeeWorkdoneDetailsOnSpecificProject  =   environment.apiUrl + 'currentMonth_DetailsOfEmployeeWorkDoneOnSpecificProject';

    public static   GET_PreviousMonthTotalEmployeeWorkdoneDetails    =   environment.apiUrl + 'previousMonthTotalEmployeeWorkdoneDetails' ; 

    public static GET_CurrentMonthTotalEmployeeWorkdoneDetails     =   environment.apiUrl +  'currentMonthTotalEmployeeWorkdoneDetails' ;

    public static   GET_PreviousMonthTotalWorkdoneOnProjectDetails   =   environment.apiUrl +  'previousMonthTotalWorkdoneOnProjectDetails' ;

    public static  GET_CurrentMonthTotalWorkdoneOnProjectDetails      =   environment.apiUrl +  'currentMonthTotalWorkdoneOnProjectDetails' ;




}
