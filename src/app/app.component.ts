import { UtilityService } from './services/utility.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private utilityService: UtilityService, private titleService: Title) {
    this.titleService.setTitle(this.utilityService.appName + " " + "Management System");
    // localStorage.setItem('branchId', '04e3d409-47c6-4de6-b3f5-50435cf0d965');
  }
}
