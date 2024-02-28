import { Component, OnInit, OnDestroy } from "@angular/core";
import { RdvService } from "src/app/services/rdv.service";
import { UserService } from "src/app/services/user.service";
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { PreferenceService } from '../../services/preference.service';
import { ServiceService } from "src/app/services/service.service";
import { BankService } from '../../services/bank.service';
@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html",
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  rdvs: any[] = [];
  page: number = 1;
  services: any[] = [];
  employees: any[] = [];
  limit: number = 10;
  totalPages: number = 0;
  dateSort: number = -1;
  formData: { date: string, employee: string, paid: number, numero: string } = { date: '', employee: "null", paid: 0, numero: '' };
  message = "";
  error: boolean = false;
  success: boolean = false;
  selectedServices: any[] = [];
  totalPrice: number = 0;
  phoneRegex = /^[0-9]{10}$/;
  isSwitchOn: boolean = false;
  temp: string = '';
  // rdv: any = [];
  prefServices: any[] = [];
  prefEmps: any[] = [];
  refill: number = 0;
  solde: any;
  constructor(private rdvservice: RdvService, private userService: UserService, private sanitizer: DomSanitizer, private route: Router, private preferenceservice: PreferenceService, private serviceservice: ServiceService, private bankservice: BankService) { }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.fetchRdv(this.page);
    this.fetchEmp();
    this.fetcPrefServices();
    this.fetcPrefEmps();
    this.fetchServices();
    this.fetchEmployees();
    this.fetchBank();
  }

  refillBank() {
    console.log(this.refill);
    const data = {
      solde: this.refill
    }
    this.bankservice.refill(data).subscribe(data => {
      console.log(data);
      this.fetchBank();
    }, err => {
      console.log(err);
    });
  }
  fetchBank() {
    this.bankservice.get().subscribe(res => {
      this.solde = res.body.solde;
    }, err => {
      console.log(err);
    });
  }
  isInPrefServices(service: any): boolean {
    return this.prefServices.some(pref => pref.service._id === service._id);
  }

  isInPrefEmps(emp: any): boolean {
    return this.prefEmps.some(pref => pref.employee._id === emp._id);
  }

  updatePrefService(service: any) {
    const data = {
      service: service
    }
    this.preferenceservice.updatePrefService(data).subscribe(data => {
      console.log(data);
      this.fetcPrefServices();
    }, err => console.log(err));
  }
  updatePrefEmp(emp: any) {
    const data = {
      employee: emp
    }
    this.preferenceservice.updatePrefEmp(data).subscribe(data => {
      console.log(data);
      this.fetcPrefEmps();

    }, err => console.log(err));
  }
  fetchServices() {
    this.serviceservice.getServices().subscribe(data => {
      this.services = data.services;
      console.log(data);
    }, err => console.log(err));
  }
  fetchEmployees() {
    this.userService.getEmployees().subscribe(data => {
      console.log(data.body.employees);
      this.employees = data.body.employees;
    });
  }

  fetcPrefServices() {
    this.preferenceservice.getPrefServices().subscribe(res => {
      this.prefServices = res.body.prefServices;
      console.log(res);
    }, err => {
      console.log(err);
    });
  }
  fetcPrefEmps() {
    this.preferenceservice.getPrefEmps().subscribe(res => {
      this.prefEmps = res.body.prefEmps;
      console.log(res);
    }, err => {
      console.log(err);
    });
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }

  flipDateSort() {
    this.dateSort = this.dateSort * -1;
    this.page = 1;
    this.fetchRdv(1);
  }

  fetchRdv(page) {
    const today = new Date();
    const dateInit = today.toISOString();

    const dateFin = new Date("20100-12-12").toISOString();

    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': this.limit, 'page': page, 'dateSort': this.dateSort }).subscribe(response => {
      if (this.page == 1) {
        this.rdvs = response.body.rdvs;
        console.log(response.body.rdvs);
      } else {
        this.rdvs = this.rdvs.concat(response.body.rdvs);
      }
      this.totalPages = response.body.totalPages;
    },
      error => {
        console.log(error);
      });
  }
  onContainerScroll() {
    const container = document.querySelector('.scrollable-table-container');
    if (container) {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        if (this.page < this.totalPages) {
          this.page += 1;
          this.fetchRdv(this.page);
        }
      }
    }
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
      console.log(response);
      this.page = 1;
      this.fetchRdv(1);
      this.temp = '';
    }, error => { console.log(error); });
  }
  user: any;
  image: any;
  files: any[];

  fetchEmp() {
    this.userService.myProfile().subscribe(data => {
      this.user = data.body.employee;
      console.log(this.user.lastName);
      const base64Image = data.body.profilePicture;
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const imageFile = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });
      this.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageFile));
      this.files = [];
      this.files.push(imageFile);
      console.log(this.files[0]);
    }, err => {
      this.userService.logout().subscribe(response => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.route.navigate(['/login']);
      }, err => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.route.navigate(['/login']);
        console.log(err);
      });
      console.log(err);
    });
  }

  // fetchServices() {
  //   this.serviceService.getServices().subscribe(data => {
  //     this.services = data.services;
  //   });
  // }
  // fetchEmployees() {
  //   this.userService.getEmployees().subscribe(data => {
  //     console.log(data.employees);
  //     this.users = data.employees;
  //   });
  // }
  // updateSelectedServices(service: any, isChecked: boolean) {
  //   if (isChecked) {
  //     this.selectedServices.push(service);
  //     this.totalPrice += service.price; // Assuming each service has a 'price' property
  //   } else {
  //     const index = this.selectedServices.indexOf(service);
  //     if (index !== -1) {
  //       this.selectedServices.splice(index, 1);
  //       this.totalPrice -= service.price;
  //     }
  //   }
  // }
  // submitForm() {
  //   if (this.formData.date.trim() === '') {
  //     this.success = false;
  //     this.error = true;
  //     setTimeout(() => {
  //       this.error = false;
  //     }, 5000);
  //     this.message = "Veuillez choisir une date!";
  //     return;
  //   }
  //   if (this.isSwitchOn) {
  //     if (!this.phoneRegex.test(this.formData.numero)) {
  //       this.success = false;
  //       this.error = true;
  //       setTimeout(() => {
  //         this.error = false;
  //       }, 5000);
  //       this.message = "Numero de telephone invalide!";
  //     }
  //     return;
  //   }
  //   if (this.selectedServices.length == 0 || this.totalPrice == 0) {
  //     this.success = false;
  //     this.error = true;
  //     setTimeout(() => {
  //       this.error = false;
  //     }, 5000);
  //     this.message = "Veuillez choisir au moins un service!";
  //     return;
  //   } else {
  //     const data = {
  //       "employee": this.formData.employee,
  //       "services": this.selectedServices,
  //       "total": this.totalPrice,
  //       "paid": this.formData.paid,
  //       "date": this.formData.date
  //     };
  //     this.rdvservice.newRdv({ data }).subscribe(
  //       response => {
  //         this.error = false;
  //         this.success = true;
  //         setTimeout(() => {
  //           this.success = false;
  //         }, 5000);
  //         this.message = response.message;
  //         // this.fetchTodaysRdv();
  //         // console.log(response);
  //       },
  //       error => {
  //         this.success = false;
  //         this.error = true;
  //         setTimeout(() => {
  //           this.error = false;
  //         }, 5000);
  //         this.message = error.error.message;
  //       }
  //     );
  //   }
  //   // console.log(data);

  // }
}
