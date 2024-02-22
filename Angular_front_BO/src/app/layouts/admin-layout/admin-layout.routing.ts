import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

import { ManageServicesComponent } from '../../manage-services/manage-services.component';
import { NewServiceComponent } from '../../manage-services/new-service/new-service.component';
import { UpdateServiceComponent } from '../../manage-services/update-service/update-service.component';

import { ManageEmployeesComponent } from '../../manage-employees/manage-employees.component';
import { UpdateEmployeeComponent } from '../../manage-employees/update-employee/update-employee.component';
import { NewEmployeeComponent } from '../../manage-employees/new-employee/new-employee.component';


import { ManageOffersComponent } from '../../manage-offers/manage-offers.component';
import { NewOfferComponent } from '../../manage-offers/new-offer/new-offer.component';
import { UpdateOfferComponent } from '../../manage-offers/update-offer/update-offer.component';

import { ManageAchatsComponent } from '../../manage-achats/manage-achats.component';
import { NewAchatComponent } from '../../manage-achats/new-achat/new-achat.component';
import { UpdateAchatComponent } from '../../manage-achats/update-achat/update-achat.component';

import { LoginComponent } from '../../login/login.component';
import { AuthGuardService } from 'app/services/auth-guard.service';
import { AuthGuardLoginService } from 'app/services/auth-guard-login.service';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardLoginService] },

    {
        path: 'services', children: [{
            path: 'list',
            component: ManageServicesComponent
        }, {
            path: 'new',
            component: NewServiceComponent
        },{
            path: 'update',
            component: UpdateServiceComponent
        }]
    },
    {
        path: 'employees', children: [{
            path: 'list',
            component: ManageEmployeesComponent
        }, {
            path: 'new',
            component: NewEmployeeComponent
        },{
            path: 'update/:id',
            component: UpdateEmployeeComponent
        }], canActivate: [AuthGuardService]
    },
    {
        path: 'offers', children: [{
            path: 'list',
            component: ManageOffersComponent
        }, {
            path: 'new',
            component: NewOfferComponent
        },{
            path: 'update',
            component: UpdateOfferComponent
        }]
    },
    {
        path: 'achats', children: [{
            path: 'list',
            component: ManageAchatsComponent
        }, {
            path: 'new',
            component: NewAchatComponent
        },{
            path: 'update',
            component: UpdateAchatComponent
        }]
    },
];