import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { ProfilepageComponent } from "./pages/profilepage/profilepage.component";
import { RegisterpageComponent } from "./pages/registerpage/registerpage.component";
import { SomeShitComponent } from './pages/some-shit/some-shit.component';
import { ClientLoginComponent } from './pages/client-login/client-login.component';

import { AuthGuardService } from "./services/auth-guard.service";
import { AuthGuardLoginService } from "./services/auth-guard-login.service";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: IndexComponent, canActivate: [AuthGuardService] },
  { path: "profile", component: ProfilepageComponent, canActivate: [AuthGuardService] },
  { path: "register", component: RegisterpageComponent, canActivate: [AuthGuardLoginService] },
  { path: "someshit", component: SomeShitComponent, canActivate: [AuthGuardService] },
  { path: "login", component: ClientLoginComponent, 
  // canActivate: [AuthGuardLoginService] 
},

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: []
})
export class AppRoutingModule { }
