import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UtilityService } from './services/utility.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private utilityService: UtilityService,
    private titleService: Title,
    private router: Router
  ) {
    this.titleService.setTitle(this.utilityService.appName + ' Management System');

    if (!environment.isBranchBuild) {
      this.router.navigate(['/sign-in']);
    }
  }
}
