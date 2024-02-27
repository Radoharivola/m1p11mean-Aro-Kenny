import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AchatsService } from 'app/services/achats.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-achat',
  templateUrl: './new-achat.component.html',
  styleUrls: ['./new-achat.component.scss']
})
export class NewAchatComponent implements OnInit {

  achatsForm: FormGroup;

  constructor(private fb: FormBuilder, private achatsService: AchatsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.achatsForm = this.fb.group({
      date: ['', Validators.required],
      motif: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  onSubmit() {
    //console.log("Why ?????????????");
    if (this.achatsForm.valid) {
      //console.log("valid");

      // if (this.serviceForm.value.motDePasse != this.serviceForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }
      // const formData = new FormData();
      // formData.append('name', this.serviceForm.value.nom);
      // formData.append('duration', this.serviceForm.value.duration);
      // formData.append('price', this.serviceForm.value.price);
      // formData.append('commission', this.serviceForm.value.commission);
      // formData.append('description', this.serviceForm.value.description);

      const data = {
        name: this.achatsForm.value.nom,
        duration: this.achatsForm.value.duration,
        price: this.achatsForm.value.price,
        commission: this.achatsForm.value.commission,
        description: this.achatsForm.value.description,
      }
      console.log(data);

      this.achatsService.newAchats({ data: data }).subscribe(
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
      console.log(this.achatsForm);

      this.markFormGroupTouched(this.achatsForm);
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
