import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'app/services/service.service';

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {

  serviceForm: FormGroup;

  constructor(private fb: FormBuilder, private serviceService: ServiceService) { }

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      nom: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required],
      commission: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  onSubmit() {
    //console.log("Why ?????????????");
    if (this.serviceForm.valid) {
      //console.log("valid");

      // if (this.serviceForm.value.motDePasse != this.serviceForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }
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
      console.log(data);

      this.serviceService.newService({ data: data }).subscribe(
        response => {
          // this.error = false;
          // this.success = true;
          // setTimeout(() => {
          //   this.success = false;
          // }, 5000);
          // this.message = response.message;
          console.log(response);
        },
        error => {
          // this.success = false;
          // this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 5000);
          // this.message = error.error.message;
          console.log(error);
        }
      );
    } else {
      console.log(this.serviceForm);

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

}
