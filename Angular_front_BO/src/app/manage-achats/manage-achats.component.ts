import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AchatsService } from 'app/services/achats.service';

@Component({
  selector: 'app-manage-achats',
  templateUrl: './manage-achats.component.html',
  styleUrls: ['./manage-achats.component.scss']
})
export class ManageAchatsComponent implements OnInit {

  constructor(private router: Router, private achatsService: AchatsService) { }
  achats: any[];

  ngOnInit(): void {
    this.fetchAchats();
  }

  navigateToAdd() {
    this.router.navigate(['/achats/new']);
  }

  navigateToUpdate() {
    this.router.navigate(['/achats/update']);
  }

  fetchAchats() {
    this.achatsService.getAchats().subscribe(data => {
      this.achats = data.achats;
      console.log(data);
    });
  }

  delete(id: string) {
    this.achatsService.deleteAchats(id).subscribe(data => {
      console.log(data);
      this.fetchAchats();
    }, error => {
      console.log(error);
    })
  }


}
