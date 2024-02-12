import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-some-shit',
  templateUrl: './some-shit.component.html',
  styleUrls: ['./some-shit.component.scss']
})
export class SomeShitComponent implements OnInit, OnDestroy {

  // isCollapsed = true;
  // focus;
  // focus1;
  // focus2;
  // date = new Date();
  // pagination = 3;
  // pagination1 = 1;
  constructor() { }
  ngOnDestroy(): void {
    // var body = document.getElementsByTagName("body")[0];
    // body.classList.remove("index-page");
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    // var body = document.getElementsByTagName("body")[0];
    // body.classList.add("index-page");

    // var slider = document.getElementById("sliderRegular");

    // noUiSlider.create(slider, {
    //   start: 40,
    //   connect: false,
    //   range: {
    //     min: 0,
    //     max: 100
    //   }
    // });

    // var slider2 = document.getElementById("sliderDouble");

    // noUiSlider.create(slider2, {
    //   start: [20, 60],
    //   connect: true,
    //   range: {
    //     min: 0,
    //     max: 100
    //   }
    // });
    throw new Error('Method not implemented.');
  }
  // scrollToDownload(element: any) {
  //   element.scrollIntoView({ behavior: "smooth" });
}



