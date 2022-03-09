import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DatePipe } from '@angular/common'
// Table Filter
import { FilterPipeModule } from 'ngx-filter-pipe';

import { TableFilterPipe } from './table-filter.pipe';

// Routing
import { routing } from './app.routing';

import { NgxSpinnerModule } from 'ngx-spinner';

// bootstrap plugin
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
// date and month piker
import { DpDatePickerModule } from 'ng2-date-picker';

import { MyDatePickerModule } from 'mydatepicker';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

// AvatarModule
import { AvatarModule } from 'ng2-avatar';

// Authguards
import { AuthGuard } from './_guards/auth.guard';

// import { NgxCheckboxModule } from 'ngx-checkbox';

// select 2
import { NgSelectModule } from '@ng-select/ng-select';

import { ImageCropperModule } from 'ngx-image-cropper';

// calendar module
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// charts
import { ChartsModule,ThemeService } from 'ng2-charts';

// HotTableModule
import { HotTableModule } from '@handsontable/angular';

import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

// toastr
import { ToastrModule } from 'ngx-toastr';

import { ModalModule } from 'ngx-bootstrap/modal';
import { UiSwitchModule } from 'ngx-ui-switch';
import {NgxPaginationModule} from 'ngx-pagination';
// Services
import { AuthService } from './_services/auth.service';
import { ApiService } from './_services/api.service';
import { AlertService } from './_services/alert.service';
import { LoaderInterceptorService } from './_services/loader-interceptor.service';

// helpers
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { IntegrateComponent } from './integrate/integrate.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminEmployeeComponent } from './admin-employeestatus/admin-employee.component';
import { AdminEmployeeUsersComponent } from './admin-employee-users/admin-employee-users.component';
import { AdminEmployeeProjectComponent } from './admin-employee-project/admin-employee-project.component';
import { AdminProjectsComponent } from './admin-projects/admin-projects.component';
import { FooterComponent } from './footer/footer.component';
import { ProjectAllocationComponent } from './project-allocation/project-allocation.component';
import { AlertComponent } from './alert/alert.component';
import { LoaderComponent } from './loader/loader.component';
import { ProfileComponent } from './profile/profile.component';
import { CapitalizePipe } from './_pipes/capitalize.pipe';
import { UserProjectsComponent } from './user-projects/user-projects.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserDailyComponent } from './usertimesheets/user-daily/user-daily.component';
import { UserWeeklyComponent } from './usertimesheets/user-weekly/user-weekly.component';
import { UserMonthlyComponent } from './usertimesheets/user-monthly/user-monthly.component';
import { UserDailyStatusComponent } from './user-daily-status/user-daily-status.component';
import { AdminDailyStatusComponent } from './admin-daily-status/admin-daily-status.component';
import { AdminLocationsComponent } from './admin-locations/admin-locations.component';
import { AdminRoleComponent } from './admin-role/admin-role.component';
import { ProjectmanagerDashboardComponent } from './projectmanager-dashboard/projectmanager-dashboard.component';
import { ProjectmanagerUsersComponent } from './projectmanager-users/projectmanager-users.component';
import { ProjectmanagerProjectsComponent } from './projectmanager-projects/projectmanager-projects.component';
import { ProjectmanagerDailystatusComponent } from './projectmanager-dailystatus/projectmanager-dailystatus.component';
import { EmployeeAllocationComponent } from './employee-allocation/employee-allocation.component';
import { ProjectManagerTimeApproveComponent } from './project-manager-time-approve/project-manager-time-approve.component';
import { HourlyProjectTimeApprovalComponent } from './hourly-project-time-approval/hourly-project-time-approval.component';
import { EmployeeAllocationsComponent } from './employee-allocations/employee-allocations.component';
import { LaptopComponent } from './laptop/laptop.component';
import { HeadsetComponent } from './headset/headset.component';
import { WifiComponent } from './wifi/wifi.component';
import { EmployeeTimeApprovalStatusComponent } from './employee-time-approval-status/employee-time-approval-status.component';
import { EmployeeHourlyTimeApprovalStatusComponent } from './employee-hourly-time-approval-status/employee-hourly-time-approval-status.component';
import { EmployeeHourlyTimesheetComponent } from './employee-hourly-timesheet/employee-hourly-timesheet.component';
import { AdminHourlyStatusComponent } from './admin-hourly-status/admin-hourly-status.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { PendingTaskListComponent } from './pending-task-list/pending-task-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { CurrentMonthProjectReport } from './current-month-project-report/current-month-project.component';
import { AdminEmployeeCurrentUsersComponent } from './admin-employee-current-users/admin-employee-current-users.component';
import { EmployeeProjectMatrixComponent } from './employee-project-matrix/employee-project-matrix.component';
import { ViewMatrixClickedDataComponent } from './view-matrix-clicked-data/view-matrix-clicked-data.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    LeftSidebarComponent,
    IntegrateComponent,
    AdminDashboardComponent,
    AdminEmployeeComponent,
    AdminEmployeeUsersComponent,
    AdminEmployeeProjectComponent,
    AdminUsersComponent,
    AdminProjectsComponent,
    FooterComponent,
    ProjectAllocationComponent,
    AlertComponent,
    LoaderComponent,
    ProfileComponent,
    CapitalizePipe,
    UserProjectsComponent,
    UserDashboardComponent,
    UserDailyComponent,
    UserWeeklyComponent,
    UserMonthlyComponent,
    UserDailyStatusComponent,
    AdminDailyStatusComponent,
    AdminLocationsComponent,
    AdminRoleComponent,
    ProjectmanagerDashboardComponent,
    ProjectmanagerUsersComponent,
    ProjectmanagerProjectsComponent,
    ProjectmanagerDailystatusComponent,
    EmployeeAllocationComponent,
    ProjectManagerTimeApproveComponent,
    HourlyProjectTimeApprovalComponent,
    EmployeeAllocationsComponent,
    LaptopComponent,
    HeadsetComponent,
    WifiComponent,
    EmployeeTimeApprovalStatusComponent,
    EmployeeHourlyTimeApprovalStatusComponent,
    EmployeeHourlyTimesheetComponent,
    AdminHourlyStatusComponent,
    TasksListComponent,
    PendingTaskListComponent,
    TableFilterPipe,
    CurrentMonthProjectReport,
    AdminEmployeeCurrentUsersComponent,
    EmployeeProjectMatrixComponent,
    ViewMatrixClickedDataComponent,
  ],
  imports: [
    BrowserModule,
    FilterPipeModule,
    // TableFilterPipe,
    routing,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    AvatarModule.forRoot(),
    NgSelectModule,
    ModalModule.forRoot(),
    AngularDateTimePickerModule,
    Ng2SearchPipeModule,
    ChartsModule,
    DpDatePickerModule,
    HotTableModule.forRoot(),
    MyDatePickerModule,
    ButtonsModule.forRoot(),
    ImageCropperModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    UiSwitchModule,
    // NgxCheckboxModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgMultiSelectDropDownModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    Ng2OrderModule
  ],
  providers: [AuthService, ApiService, AlertService, AuthGuard,ThemeService,DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
