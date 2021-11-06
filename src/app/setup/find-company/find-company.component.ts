import { Company } from './../../models/company';
import { SetupService } from './../services/setup.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-find-company',
  templateUrl: './find-company.component.html',
  styleUrls: ['./find-company.component.scss']
})
export class FindCompanyComponent implements OnInit {
  company: Company;
  errorMessage: string;
  isFetchingCompany: boolean;
  isErrorFetchingCompany: boolean;
  localServerUrl = localStorage.getItem('local-server-url');

  constructor(private setupService: SetupService) { }

  ngOnInit(): void {
    this.isFetchingCompany = true;
    this.isErrorFetchingCompany = false;

    this.setupService.fetchCompanies()
    .subscribe(companies => {
      this.isFetchingCompany = false;

      this.company = companies[0];
      localStorage.setItem(
        'branch-setup-company',
        JSON.stringify(this.company)
      );
    }, error => {
      this.isFetchingCompany = false;
      this.isErrorFetchingCompany = true;

      console.error(error);
      switch(error.status) {
        case 0: {
          this.errorMessage = 'You are not connected to your local network.'
          break;
        }
        case 404: {
          this.errorMessage = 'Your network configuration may not be correct.';
          break;
        }
        case 500: {
          this.errorMessage = 'An unexpected error has occurred.';
          break;
        }
        default: {
          this.errorMessage = 'An unknown error has occurred.';
        }
      }
    });
  }

}
