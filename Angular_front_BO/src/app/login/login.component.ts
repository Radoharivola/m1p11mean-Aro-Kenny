import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  unmatched: boolean = false;

  constructor(private fb: FormBuilder, private userservice: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifiant: ['', Validators.required],
      motDePasse: ['', Validators.required]
    });
  }


  test() {
    if (this.loginForm.valid) {
      // if (this.loginForm.value.motDePasse != this.loginForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }
      const data = {
        username: this.loginForm.value.identifiant,
        password: this.loginForm.value.motDePasse
      }
      this.userservice.login({ data }).subscribe(
        response => {
          console.log("success");
          console.log(response);
          const user = response.body.user;
          localStorage.setItem('token', btoa(user.role));
          localStorage.setItem('username', user.username);
          this.router.navigate(['/']);
        },
        error => {
          console.log("NOOOOOOOO MIGUEL");

          console.log(error);
        }
      );
    } else {
      console.log("not valid");
      this.markFormGroupTouched(this.loginForm);
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
