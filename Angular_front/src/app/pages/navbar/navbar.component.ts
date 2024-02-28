import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from "src/app/services/user.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  isLoggedIn: boolean = false;
  private unsubscribe$: Subject<void> = new Subject();


  constructor(private spinner: NgxSpinnerService, private router: Router, private userservice: UserService) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.unsubscribe$)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/') {
        this.scrollToAppointment();
      }
    });

    this.isLoggedIn = this.userservice.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  scrollToAppointment() {
    setTimeout(() => {
      const appointmentElement = document.getElementById('appointment');
      if (appointmentElement) {
        appointmentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  logout() {
    this.spinner.show();
    this.userservice.logout().subscribe(res => {
      localStorage.removeItem('uToken');
      localStorage.removeItem('username');
      this.router.navigate(['/login']);
      window.location.reload();

      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      console.log(err);
    });
  }

}
