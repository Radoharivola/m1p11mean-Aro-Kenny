import { Component, OnInit, OnDestroy } from "@angular/core";
import { ServiceService } from '../../services/service.service';
import { RdvService } from '../../services/rdv.service';

import { UserService } from '../../services/user.service';

@Component({
  selector: "app-index",
  templateUrl: "index.component.html",
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  error: boolean = false;
  success: boolean = false;
  message = "";
  services: any[];
  employees: any[];
  selectedServices: any[] = [];
  totalPrice: number = 0;
  isSwitchOn: boolean = false;
  client = "65c0c12041f49e5ca93ded6e";

  phoneRegex = /^[0-9]{10}$/;

  formData: { date: string, employee: object, paid: number, numero: string } = { date: '', employee: null, paid: 0, numero: '' };
  constructor(private serviceService: ServiceService, private userService: UserService, private rdvservice: RdvService) { }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.fetchServices();
    this.fetchEmployees();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }

  fetchServices() {
    this.serviceService.getServices().subscribe(data => {
      this.services = data.services;
    });
  }
  fetchEmployees() {
    this.userService.getEmployees().subscribe(data => {
      console.log(data.employees);
      this.employees = data.employees;
    });
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
}
