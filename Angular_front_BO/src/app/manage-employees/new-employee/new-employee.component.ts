import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';


@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss'],
})
export class NewEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  unmatched: boolean = false;

  files: File[] = [];
  fileEmpty: boolean = false;
  constructor(private fb: FormBuilder, private userservice: UserService) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      identifiant: ['', Validators.required],
      telephone: ['', Validators.required],
      motDePasse: ['', Validators.required],
      confirmerMotDePasse: ['', Validators.required]
    });
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);

    const formData = new FormData();

    for (var i = 0; i < this.files.length; i++) {
      formData.append("file[]", this.files[i]);
    }

    // this.http.post('http://localhost:8001/upload.php', formData)
    // .subscribe(res => {
    //    console.log(res);
    //    alert('Uploaded Successfully.');
    // })
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSubmit() {
    if (this.files.length === 0) {
      this.fileEmpty = true;
      setTimeout(() => {
        this.fileEmpty = false;
      }, 5000);
      return;
    }

    if (this.employeeForm.valid) {
      // if (this.employeeForm.value.motDePasse != this.employeeForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }
      const formData = new FormData();
      formData.append('pic', this.files[0]);
      formData.append('username', this.employeeForm.value.identifiant);
      formData.append('password', this.employeeForm.value.motDePasse);
      formData.append('role', "employee");
      formData.append('firstName', this.employeeForm.value.prenom);
      formData.append('lastName', this.employeeForm.value.nom);
      formData.append('email', this.employeeForm.value.email);
      formData.append('phone', this.employeeForm.value.telephone);

      this.userservice.newEmployee({ formData }).subscribe(
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
      this.markFormGroupTouched(this.employeeForm);
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
