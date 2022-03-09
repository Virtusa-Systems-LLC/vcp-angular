import { Routes, RouterModule } from '@angular/router';
// import auth guards
import { AuthGuard } from './_guards/auth.guard';
// import components
import { LoginComponent } from './login/login.component';
import { IntegrateComponent } from './integrate/integrate.component';

import {ViewMatrixClickedDataComponent} from './view-matrix-clicked-data/view-matrix-clicked-data.component';

// @RouteConfig([{path: '/component/:id/:id2',name: 'MyCompB', component:MyCompB}])
const appRoutes: Routes = [
    /*fetch total work details of employee based on employee_id and :project_id*/
     { path: 'employeeprojectworkdone/:month/:employee_id/:project_id' , component: ViewMatrixClickedDataComponent, canActivate: [AuthGuard] },
     /**fetch total work details of employee based on employee_id  */
     { path: 'employeetotalworkdone/:month/:employee_id' , component: ViewMatrixClickedDataComponent, canActivate: [AuthGuard] }, 
     /**fetch total work details in a project  based on project_id  */
     { path: 'projecttotalworkdone/:month/:project_id/:dailyTimeEntryRequiredFlag' , component: ViewMatrixClickedDataComponent, canActivate: [AuthGuard] },
     { path: 'login', component: LoginComponent },
     { path: ':pageName', component: IntegrateComponent, canActivate: [AuthGuard] },
     { path: '', component: LoginComponent }
];

export const routing = RouterModule.forRoot(appRoutes);
