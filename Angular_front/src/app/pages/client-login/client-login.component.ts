import { Component, OnInit, OnDestroy, HostListener, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "src/app/services/user.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.scss']
})



export class ClientLoginComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  focus0;
  focus1;
  loading: boolean = false;
  loginForm: FormGroup;
  error: boolean = false;
  success: boolean = false;
  message: string = '';
  hidden: boolean = false;

  constructor(private fb: FormBuilder, private userservice: UserService, private spinner: NgxSpinnerService, private router: Router, private elementRef: ElementRef) { }
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


    this.loginForm = this.fb.group({
      identifiant: ['paul', Validators.required],
      motDePasse: ['aZ12345678', Validators.required]
    });
    console.log("init login page");
    // this.onMouseMove(event);

  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    console.log("destroyingu: " + body);
    body.classList.remove("register-page");
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.spinner.show();
      const data = {
        username: this.loginForm.value.identifiant,
        password: this.loginForm.value.motDePasse
      };
      this.userservice.login({ data }).subscribe(
        response => {
          this.error = false;
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 5000);
          this.message = response.message;
          const user = response.body.user;
          localStorage.setItem('uToken', btoa(user.role));
          localStorage.setItem('username', user.username);
          console.log(localStorage.getItem('uToken'));
          this.router.navigate(['/']);
          window.location.reload();
          console.log(response);
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();

          this.success = false;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 5000);
          this.message = error.error.error
          console.log(error.error.error);
        }
      );
      console.log("Form submitted successfully");
    } else {
      console.log("not valid");
      // Mark all fields as touched to display errors
      this.loginForm.markAllAsTouched();
    }
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    // }, 5000);
  }
  // test() {
  //   this.userservice.test().subscribe(
  //     response => {
  //       // this.error = false;
  //       // this.success = true;
  //       // setTimeout(() => {
  //       //   this.success = false;
  //       // }, 5000);
  //       // this.message = response.message;
  //       console.log(response);
  //     },
  //     error => {
  //       // this.success = false;
  //       // this.error = true;
  //       // setTimeout(() => {
  //       //   this.error = false;
  //       // }, 5000);
  //       // this.message = error.error.message;
  //       console.log(error);
  //     }
  //   );
  //   console.log(this.userservice.isLoggedIn());
  // }
  togglePasswordVisibility(inputField: HTMLInputElement) {
    if (this.hidden) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
    inputField.type = inputField.type === 'text' ? 'password' : 'text';
  }
}
