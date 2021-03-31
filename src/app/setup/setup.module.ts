import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SetupRoutingModule } from './setup-routing.module';
import { SetupComponent } from './setup/setup.component';
import { CompanySetupComponent } from './company-setup/company-setup.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { SelectBranchComponent } from './select-branch/select-branch.component';
import { FinishComponent } from './finish/finish.component';


@NgModule({
  declarations: [
    SetupComponent,
    CompanySetupComponent, CompanyDetailComponent, SelectBranchComponent, FinishComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatFormFieldModule,
    SetupRoutingModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class SetupModule { }
