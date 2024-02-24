import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
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

  constructor(private fb: FormBuilder, private userservice: UserService, private route: Router) { }
  // @HostListener("document:mousemove", ["$event"])
  // onMouseMove(e) {
  //   var squares1 = document.getElementById("square1");
  //   var squares2 = document.getElementById("square2");
  //   var squares3 = document.getElementById("square3");
  //   var squares4 = document.getElementById("square4");
  //   var squares5 = document.getElementById("square5");
  //   var squares6 = document.getElementById("square6");
  //   var squares7 = document.getElementById("square7");
  //   var squares8 = document.getElementById("square8");

  //   var posX = e.clientX - window.innerWidth / 2;
  //   var posY = e.clientY - window.innerWidth / 6;

  //   squares1.style.transform =
  //     "perspective(500px) rotateY(" +
  //     posX * 0.05 +
  //     "deg) rotateX(" +
  //     posY * -0.05 +
  //     "deg)";
  //   squares2.style.transform =
  //     "perspective(500px) rotateY(" +
  //     posX * 0.05 +
  //     "deg) rotateX(" +
  //     posY * -0.05 +
  //     "deg)";
  //   squares3.style.transform =
  //     "perspective(500px) rotateY(" +
  //     posX * 0.05 +
  //     "deg) rotateX(" +
  //     posY * -0.05 +
  //     "deg)";
  //   squares4.style.transform =
  //     "perspective(500px) rotateY(" +
  //     posX * 0.05 +
  //     "deg) rotateX(" +
  //     posY * -0.05 +
  //     "deg)";
  //   squares5.style.transform =
  //     "perspective(500px) rotateY(" +
  //     posX * 0.05 +
  //     "deg) rotateX(" +
  //     posY * -0.05 +
  //     "deg)";
  //   squares6.style.transform =
  //     "perspective(500px) rotateY(" +
  //     posX * 0.05 +
  //     "deg) rotateX(" +
  //     posY * -0.05 +
  //     "deg)";
  //   squares7.style.transform =
  //     "perspective(500px) rotateY(" +
  //     posX * 0.02 +
  //     "deg) rotateX(" +
  //     posY * -0.02 +
  //     "deg)";
  //   squares8.style.transform =
  //     "perspective(500px) rotateY(" +
  //     posX * 0.02 +
  //     "deg) rotateX(" +
  //     posY * -0.02 +
  //     "deg)";
  // }

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

      // this.userservice.newUser({ formData }).subscribe(
      //   response => {
      //     // this.error = false;
      //     // this.success = true;
      //     // setTimeout(() => {
      //     //   this.success = false;
      //     // }, 5000);
      //     // this.message = response.message;

      //     console.log(response);
      //   },
      //   error => {
      //     // this.success = false;
      //     // this.error = true;
      //     // setTimeout(() => {
      //     //   this.error = false;
      //     // }, 5000);
      //     // this.message = error.error.message;
      //     console.log(error);
      //   }
      // );
      this.route.navigate(['/login']);
      console.log("Form submitted successfully");
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
