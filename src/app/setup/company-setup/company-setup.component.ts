import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { Company } from './../../models/company';
import { CompanyService } from './../../services/company.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-company-setup',
  templateUrl: './company-setup.component.html',
  styleUrls: ['./company-setup.component.scss']
})
export class CompanySetupComponent implements OnInit {
  form: FormGroup;
  showOverlay: boolean;
  isFetchingCompany: boolean;

  constructor(
    private companyService: CompanyService, 
    private matSnackBar: MatSnackBar,
    private dialogOpener: MatDialog,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.form = new FormGroup({
        id: new FormControl()
      });
    }

  ngOnInit(): void {
  }

  fetchCompany() {
    this.isFetchingCompany = true;

    this.companyService.fetchCompany(this.form.value['id'])
    .subscribe(company => {
      this.showOverlay = true;
      this.isFetchingCompany = false;

      localStorage.clear();
      localStorage.removeItem('company');
      localStorage.removeItem('companyId');
      localStorage.removeItem('setup-stage');

      localStorage.setItem('companyId', company.id);
      localStorage.setItem('company', JSON.stringify(company));
      localStorage.setItem('setup-stage', 'product-detail');

      this.companyService.companyId = company.id;
      
      
      const randomNumber = Math.floor(Math.random() * 10000);
      setTimeout(() => {
        this.router.navigate(['../company-detail'], { relativeTo: this.route });        
      }, randomNumber);

    }, error => {
      this.isFetchingCompany = false;
      console.log(error);

      switch(error.status) {
        case 0: {
          this.matSnackBar.open('You are offline', 'OK', {
            duration: 10000
          })
          break;
        }
        case 404: {
          this.dialogOpener.open(OkDialogComponent, {
            data: {
              title: "Wrong ID",
              message: "The ID you have entered is not in our system. " + 
              "Check it well and try again.",
              okButtonText: 'OK'
            }
          });
          break;
        }
        case 500: {
          this.dialogOpener.open(OkCancelDialogComponent, {
            data: {
              title: "Unexpected Error",
              message: "An unexpected error has occurred. Please try again later.",
              okButtonText: 'TRY AGAIN',
              cancelButtonText: 'CLOSE'
            }
          })
          .componentInstance
          .ok
          .subscribe(() => {
            this.fetchCompany()
          })
        }
      }
    });
  }

}
