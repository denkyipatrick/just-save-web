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
    this.titleService.setTitle(this.utilityService.appName + ' Management System');
  }
}
