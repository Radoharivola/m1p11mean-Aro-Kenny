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
import { LoginComponent } from '../../login/login.component';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { MatIconModule } from '@angular/material/icon';
import { ManageWsComponent } from 'app/manage-ws/manage-ws.component';
import { UpdateWsComponent } from 'app/manage-ws/update-ws/update-ws.component';
import { ManageOffersComponent } from 'app/manage-offers/manage-offers.component';
import { NewOfferComponent } from 'app/manage-offers/new-offer/new-offer.component';
import { UpdateOfferComponent } from 'app/manage-offers/update-offer/update-offer.component';

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
    NgxDropzoneModule,
    MatIconModule
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
    LoginComponent,
    RelativeTimePipe,
    ManageWsComponent,
    UpdateWsComponent,
    ManageOffersComponent,
    NewOfferComponent,
    UpdateOfferComponent
  ]
})

export class AdminLayoutModule { }