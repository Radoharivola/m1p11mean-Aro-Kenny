import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from 'app/services/user.service';
@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.scss']
})
export class ManageEmployeesComponent implements OnInit {
  sortBy: string = 'lastName';
  sortOrder: number = 1;
  searchString: string = '';

  employees: any[];
  constructor(private router: Router, private userservice: UserService) { }

  ngOnInit(): void {
    this.fetchEmployees();
  }
  navigateToAnotherPage() {
    // Navigate to another page when the button is clicked
    this.router.navigate(['/employees/new']); // Replace 'your-other-page' with the route path of the page you want to navigate to
  }

  navigateToUpdate(id: string) {
    // Navigate to another page when the button is clicked
    this.router.navigate(['/employees/update', id]); // Replace 'your-other-page' with the route path of the page you want to navigate to
  }

  fetchEmployees() {
    this.userservice.getEmployees({ 'searchString': this.searchString, 'sortBy': this.sortBy, 'sortOrder': this.sortOrder }).subscribe(data => {
      this.employees = data.employees;
    }, error => {
      console.log(error);
    })
  }
  setSort(arg0: string) {
    this.sortOrder = -1 * this.sortOrder;
    this.sortBy = arg0;
    this.fetchEmployees();
  }
  updateSearchString(input:string) {
    this.searchString = input;
    this.fetchEmployees();
  }
  delete(id: string) {
    this.userservice.deleteEmployee(id).subscribe(data => {
      console.log(data);
      this.fetchEmployees();
    }, error => {
      console.log(error);
    })
  }
}
