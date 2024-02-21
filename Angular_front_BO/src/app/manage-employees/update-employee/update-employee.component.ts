import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss']
})
export class UpdateEmployeeComponent implements OnInit {
  employeeId: string;
  employeeForm: FormGroup;
  unmatched: boolean = false;

  fileEmpty: boolean = false;

  employee: any;

  files: File[] = [];
  constructor(private fb: FormBuilder, private userservice: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.userservice.getEmployee(this.employeeId).subscribe(data => {
        this.employee = data.employee;
        console.log(this.employee.firstName);
        this.initForm();
      }, err => console.log(err));
    });
  }

  initForm() {
    this.employeeForm = this.fb.group({
      nom: [this.employee.lastName, Validators.required],
      prenom: [this.employee.firstName, Validators.required],
      email: [this.employee.email, [Validators.required, Validators.email]],
      identifiant: [this.employee.username, Validators.required],
      telephone: [this.employee.phone, Validators.required],
      motDePasse: [''],
      confirmerMotDePasse: ['']
    });
  }


  onSelect(event) {
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
      console.log(formData);
      this.userservice.updateEmployee({ 'formData': formData, 'id': this.employeeId }).subscribe(
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
          console.log("foryyyy");
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
