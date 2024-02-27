import { Component, OnInit, OnDestroy } from "@angular/core";
import { ServiceService } from '../../services/service.service';
import { RdvService } from '../../services/rdv.service';

import { UserService } from '../../services/user.service';

import { OfferService } from '../../services/offer.service';
import { Router } from "@angular/router";

@Component({
  selector: "app-index",
  templateUrl: "index.component.html",
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  dateSort: number = -1;
  page: number = 1;
  error: boolean = false;
  success: boolean = false;
  message = "";
  services: any[];
  employees: any[];
  selectedServices: any[] = [];
  totalPrice: number = 0;
  isSwitchOn: boolean = false;
  client = "65c0c12041f49e5ca93ded6e";


  offers: any[];
  todaysRdv: any[];
  history: any[];

  phoneRegex = /^[0-9]{10}$/;

  formData: { date: string, employee: string, paid: number, numero: string } = { date: '', employee: "null", paid: 0, numero: '' };
  limit: number = 10;
  totalPages: number = 0;


  temp: string = '';



  constructor(private serviceService: ServiceService, private userService: UserService, private rdvservice: RdvService, private offerservice: OfferService, private route: Router) { }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.fetchServices();
    this.fetchEmployees();
    this.fetchTodaysRdv();
    this.fetchRdvHistory(this.page);
    this.fetchOffers();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
  fetchOffers() {
    this.offerservice.getOffers({ 'date': new Date().toISOString() }).subscribe(
      response => {
        console.log(response.offers);
        this.offers = response.offers;
      },
      error => {
        console.log(error);
      }
    );
  }

  setSelectedServices(services: any[], reduction: number) {
    // this.selectedServices = services;
    // const totalPrice = this.selectedServices.reduce((total, service) => total + service.price, 0);

    // console.log(this.selectedServices);
  }

  fetchServices() {
    this.serviceService.getServices().subscribe(data => {
      this.services = data.services;
    });
  }
  fetchEmployees() {
    this.userService.getEmployees().subscribe(data => {
      console.log(data.body.employees);
      this.employees = data.body.employees;
    });
  }
  fetchTodaysRdv() {
    const today = new Date();

    // Set dateInit to today's date
    const dateInit = today.toISOString();

    // Set dateFin to today's date at 23:59:59
    today.setHours(23, 59, 59, 999);
    const dateFin = today.toISOString();
    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 10, 'page': 1, 'dateSort': 1 }).subscribe(response => {
      console.log(response);
      this.todaysRdv = response.body.rdvs;
    },
      error => {
        this.userService.logout().subscribe(res => {
          localStorage.removeItem('uToken');
          localStorage.removeItem('username');
          this.route.navigate(['/login']);
        }, err => {
          console.log(err);
        }
        );
        console.log(error);
      });
  }

  fetchRdvHistory(page) {
    const today = new Date();
    const dateFin = today.toISOString();

    const dateInit = new Date("1970-01-01").toISOString();

    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': this.limit, 'page': page, 'dateSort': this.dateSort }).subscribe(response => {
      if (this.page == 1) {
        this.history = response.body.rdvs;
        console.log(response.body.rdvs);
      } else {
        this.history = this.history.concat(response.body.rdvs);
      }
      this.totalPages = response.body.totalPages;
    },
      error => {
        console.log(error);
      });
  }

  flipDateSort() {
    this.dateSort = this.dateSort * -1;
    this.page = 1;
    this.fetchRdvHistory(1);
  }

  onContainerScroll() {
    const container = document.querySelector('.scrollable-table-container');
    if (container) {
      // Check if the user has scrolled to the bottom of the container
      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        if (this.page < this.totalPages) {
          this.page += 1;
          this.fetchRdvHistory(this.page);
        }
      }
    }
  }

  updateSelectedServices(service: any, isChecked: boolean) {
    if (isChecked) {
      this.selectedServices.push(service);
      this.totalPrice += service.price; // Assuming each service has a 'price' property
    } else {
      const index = this.selectedServices.indexOf(service);
      if (index !== -1) {
        this.selectedServices.splice(index, 1);
        this.totalPrice -= service.price;
      }
    }
  }


  submitForm() {
    if (this.formData.date.trim() === '') {
      this.success = false;
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 5000);
      this.message = "Veuillez choisir une date!";
      return;
    }
    if (this.isSwitchOn) {
      if (!this.phoneRegex.test(this.formData.numero)) {
        this.success = false;
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, 5000);
        this.message = "Numero de telephone invalide!";
      }
      return;
    }
    if (this.selectedServices.length == 0 || this.totalPrice == 0) {
      this.success = false;
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 5000);
      this.message = "Veuillez choisir au moins un service!";
      return;
    } else {
      const data = {
        "client": this.client,
        "employee": this.formData.employee,
        "services": this.selectedServices,
        "total": this.totalPrice,
        "paid": this.formData.paid,
        "date": this.formData.date
      };
      this.rdvservice.newRdv({ data }).subscribe(
        response => {
          this.error = false;
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
          this.message = response.message;
          this.fetchTodaysRdv();
          // console.log(response);
        },
        error => {
          this.success = false;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 5000);
          this.message = error.error.message;
        }
      );
    }
    // console.log(data);

  }
  tempId(id: string) {
    this.temp = id;
    console.log(this.temp);
  }

  // loadRdvData(id: string) {
  //   this.rdvservice.get({ id }).subscribe(response => {
  //     this.rdv = response.body.rdv;
  //     this.formData.date=this.rdv.date;
  //   }, err => {
  //     console.log(err);
  //   })
  // }

  delete() {
    this.rdvservice.delete(this.temp).subscribe(response => {
      this.page = 1;
      this.fetchTodaysRdv();
      this.temp = '';
    }, error => { console.log(error); });
  }
}
