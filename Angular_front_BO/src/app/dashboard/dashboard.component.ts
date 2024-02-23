import { Component, OnInit } from '@angular/core';
import { RdvService } from 'app/services/rdv.service';
import * as Chartist from 'chartist';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todaysRdv: any[];
  weeksRdv: any[];
  weekDateSort: number = 1;
  todayDateSort: number = 1;

  constructor(private rdvservice: RdvService, private router: Router,private userservice: UserService) { }
  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };
  ngOnInit() {
    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);


    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);



    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);


    this.fetchTodaysRdv();
    this.fetchThisWeeksRdv();
  }



  fetchTodaysRdv() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Set dateInit to today's date
    const dateInit = today.toISOString();

    // Set dateFin to today's date at 23:59:59
    today.setHours(23, 59, 59, 999);
    const dateFin = today.toISOString();
    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 100, 'page': 1, 'dateSort': this.todayDateSort }).subscribe(response => {
      console.log(response.body.rdvs);
      this.todaysRdv = response.body.rdvs;
    },
      error => {
        console.log(error);
          // Unauthorized error, redirect to login page
          this.userservice.logout(); // Adjust the route as per your application
      });
  }

  flipWeekDateSort() {
    this.weekDateSort = this.weekDateSort * -1;
    this.fetchThisWeeksRdv();
  }

  flipTodayDateSort() {
    this.todayDateSort = this.todayDateSort * -1;
    this.fetchTodaysRdv();
  }

  fetchThisWeeksRdv() {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const lastDayOfWeek = new Date(today);

    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when today is Sunday

    firstDayOfWeek.setDate(diff);
    lastDayOfWeek.setDate(diff + 6);

    // Set time to beginning of the first day
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const dateInit = firstDayOfWeek.toISOString();

    // Set time to end of the last day
    lastDayOfWeek.setHours(23, 59, 59, 999);
    const dateFin = lastDayOfWeek.toISOString();
    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 100, 'page': 1, 'dateSort': this.weekDateSort }).subscribe(response => {
      console.log(response);
      this.weeksRdv = response.body.rdvs;
    },
      error => {
        console.log(error);
          // Unauthorized error, redirect to login page
          this.userservice.logout(); // Adjust the route as per your application
      });
  }
}
