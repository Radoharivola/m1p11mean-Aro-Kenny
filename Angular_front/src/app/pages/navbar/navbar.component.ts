import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from "src/app/services/user.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  isLoggedIn: boolean = false;
  private unsubscribe$: Subject<void> = new Subject();


  constructor(private router: Router, private userservice: UserService) { }

  ngOnInit(): void {
    // Subscribe to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.unsubscribe$)
    ).subscribe((event: NavigationEnd) => {
      // Check if navigation ends at the home page
      if (event.urlAfterRedirects === '/') {
        this.scrollToAppointment();
      }
    });

    this.isLoggedIn = this.userservice.isLoggedIn();
  }

  ngOnDestroy(): void {
    // Unsubscribe from router events when the component is destroyed
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

}
