import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-registerpage",
  templateUrl: "registerpage.component.html",
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit, OnDestroy {

  files: File[] = [];
  isCollapsed = true;
  focus0;
  focus1;
  focus2;
  focus3;
  focus4;
  focus5;

  registrationForm: FormGroup;
  success: boolean = false;
  error: boolean = false;
  message: string='';
  constructor(private fb: FormBuilder, private userservice: UserService, private route: Router,private spinner: NgxSpinnerService) { }


  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");

    // this.onMouseMove(event);


    // Initialize the form with FormBuilder
    this.registrationForm = this.fb.group({
      identifiant: ['', Validators.required],
      nom: ['', Validators.required],
      prenoms: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      telephone: ['', Validators.required]
    });
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  fileEmpty: boolean = false;
  onSubmit() {
    if (this.files.length === 0) {
      this.fileEmpty = true;
      setTimeout(() => {
        this.fileEmpty = false;
      }, 5000);
      return;
    }
    // Check if the form is valid
    if (this.registrationForm.valid) {
      // console.log(this.registrationForm);
      const formData = new FormData();
      formData.append('pic', this.files[0]);
      formData.append('username', this.registrationForm.value.identifiant);
      formData.append('password', this.registrationForm.value.motDePasse);
      formData.append('role', "client");
      formData.append('firstName', this.registrationForm.value.prenoms);
      formData.append('lastName', this.registrationForm.value.nom);
      formData.append('email', this.registrationForm.value.email);
      formData.append('phone', this.registrationForm.value.telephone);
      this.spinner.show();
      this.userservice.newUser({ formData }).subscribe(
        response => {
          this.error = false;
          setTimeout(() => {
            this.spinner.hide();
            this.route.navigate(['/login']);
          }, 3000);
          this.message = response.message;

          console.log(response);
        },
        error => {
          this.spinner.hide();
          this.success = false;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 5000);
          this.message = error.error.error;
        }
      );
    } else {
      // Mark all fields as touched to display errors
      this.registrationForm.markAllAsTouched();
    }
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
