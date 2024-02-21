import { Component, OnInit, OnDestroy } from "@angular/core";
import { RdvService } from "src/app/services/rdv.service";
@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html",
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  rdvs: any[] = [];
  page: number = 1;

  limit: number = 10;
  totalPages: number = 0;
  dateSort: number = -1;

  constructor(private rdvservice: RdvService) { }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
    this.fetchRdv(this.page);
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }



  fetchRdv(page) {
    const today = new Date();
    const dateInit = today.toISOString();

    const dateFin = new Date("20100-12-12").toISOString();

    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': this.limit, 'page': page, 'dateSort': this.dateSort }).subscribe(response => {
      if (this.page == 1) {
        this.rdvs = response.body.rdvs;
        console.log(response.body.rdvs);
      } else {
        this.rdvs = this.rdvs.concat(response.body.rdvs);
      }
      this.totalPages = response.body.totalPages;
    },
      error => {
        console.log(error);
      });
  }
}
