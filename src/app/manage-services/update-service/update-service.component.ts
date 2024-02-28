import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from 'app/services/service.service';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.scss']
})
export class UpdateServiceComponent implements OnInit {

  serviceId: string;
  serviceForm: FormGroup;

  service: any;

  constructor(private spinner: NgxSpinnerService, private router: Router, private fb: FormBuilder, private serviceService: ServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = params['id'];
      this.serviceService.getService(this.serviceId).subscribe(data => {
        this.service = data.service;
        //console.log(this.service.name);
        this.initForm();
      }, err => console.log(err));
    });
  }

  initForm() {
    this.serviceForm = this.fb.group({
      nom: [this.service.name, Validators.required],
      duration: [this.service.duration, Validators.required],
      price: [this.service.price, Validators.required],
      commission: [this.service.commission, Validators.required],
      description: [this.service.description, Validators.required]
    });
    //console.log(this.serviceForm.value.nom);
  }

  onSubmit() {
  
    if (this.serviceForm.valid) {
      // if (this.employeeForm.value.motDePasse != this.employeeForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }
      
      // const formData = new FormData();
      // formData.append('name', this.serviceForm.value.nom);
      // formData.append('duration', this.serviceForm.value.duration);
      // formData.append('price', this.serviceForm.value.price);
      // formData.append('commission', this.serviceForm.value.commission);
      // formData.append('description', this.serviceForm.value.description);

      const data = {
        name: this.serviceForm.value.nom,
        duration: this.serviceForm.value.duration,
        price: this.serviceForm.value.price,
        commission: this.serviceForm.value.commission,
        description: this.serviceForm.value.description,
      }
      
      console.log(this.serviceForm.value.commission);
      this.spinner.show();
      this.serviceService.updateService({ 'data': data, 'id': this.serviceId }).subscribe(
        response => {
          // this.error = false;
          // this.success = true;
          // setTimeout(() => {
          //   this.success = false;
          // }, 5000);
          // this.message = response.message;
          this.spinner.hide();
          this.showNotification('Service mise à jour', 'success');
          console.log(response);
        },
        error => {
          // this.success = false;
          // this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 5000);
          // this.message = error.error.message;
          console.log("fy");
        }
      );
      this.router.navigate(['/services/list']);
    } else {
      this.markFormGroupTouched(this.serviceForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  showNotification(message: string, type: string) {
    // const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: message

    }, {
      type: type,
      timer: 4000,
      placement: {
        from: 'top',
        align: 'center'
      },
      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="material-icons" data-notify="icon">notifications</i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }

}
