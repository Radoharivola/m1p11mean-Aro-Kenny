import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss']
})
export class ManageOffersComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  navigate() {
    this.router.navigate(['/offers/new']);
  }
}
