import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfferService } from '../services/offer.service';

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss']
})
export class ManageOffersComponent implements OnInit {

  constructor(private router: Router, private offerservice: OfferService) { }

  offers: any[];

  ngOnInit(): void {
    this.fetchOffers();
  }
  navigate() {
    this.router.navigate(['/offers/new']);
  }

  

  fetchOffers() {
    this.offerservice.getOffers().subscribe(data => {
        this.offers = data.offers;
        console.log(data.offers);
      });
  }
}
