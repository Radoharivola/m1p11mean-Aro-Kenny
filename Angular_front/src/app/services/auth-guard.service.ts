import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service'; // Update the path to auth.service

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: UserService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Allow access to the route
    } else {
      this.authService.logout().subscribe(res => {
        this.router.navigate(['/login']);
      }, err => {
        this.router.navigate(['/login']);
      });
      return false; // Deny access to the route
    }
  }

}
