import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UpdateEmployeeComponent } from 'app/manage-employees/update-employee/update-employee.component';
import { NewEmployeeComponent } from 'app/manage-employees/new-employee/new-employee.component';
import { ManageEmployeesComponent } from 'app/manage-employees/manage-employees.component';
import { ManageServicesComponent } from 'app/manage-services/manage-services.component';
import { NewServiceComponent } from 'app/manage-services/new-service/new-service.component';
import { UpdateServiceComponent } from 'app/manage-services/update-service/update-service.component';
import { ManageAchatsComponent } from 'app/manage-achats/manage-achats.component';
import { NewAchatComponent } from 'app/manage-achats/new-achat/new-achat.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgxDropzoneModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
    UpgradeComponent,
    UpdateEmployeeComponent,
    NewEmployeeComponent,
    ManageEmployeesComponent,
    ManageServicesComponent,
    NewServiceComponent,
    UpdateServiceComponent,
    ManageAchatsComponent,
    NewAchatComponent
  ]
})

export class AdminLayoutModule { }