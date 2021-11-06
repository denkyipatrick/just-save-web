import { CompanyService } from './../services/company.service';
import { Company } from './../models/company';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  company: Company;
  setupStage: string;

  fetchingCompany: boolean;
  networkErrorMessage: string;
  errorFetchingCompany: boolean;

  showLoginSection: boolean;
  showSetupSection: boolean;

  constructor(private companyService: CompanyService) {
    // localStorage.clear();

    this.company = JSON.parse(localStorage.getItem('company'));
    this.setupStage = localStorage.getItem('setup-stage');
  }

  ngOnInit(): void {
    // this.startSetupProcess();
  }

  startSetupProcess() {
    if (!this.company) {
      this.showSetupSection = true;
    } else {
      this.fetchingCompany = true;
      this.errorFetchingCompany = false;

      this.companyService.fetchCompany(this.company.id)
      .subscribe(company => {
        this.fetchingCompany = false;

        if (this.company.id !== company.id) {
          this.showSetupSection = true;
        } else {
          switch (this.setupStage) {
            case 'completed': {
              this.showLoginSection = true;
              break;
            }
            default: {
              this.showSetupSection = true;
            }
          }
        }
      }, error => {
        this.fetchingCompany = false;

        switch (error.status) {
          case 0: {
            this.errorFetchingCompany = true;
            this.networkErrorMessage = 'Please check your network and try again.';
            break;
          }
          case 404: {
            // company was not found.
            this.showSetupSection = true;
          }
        }
      });
    }
  }

}
