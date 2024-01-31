import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;

  constructor() { }

  ngOnInit(): void {
  }

}
