import { FinishComponent } from './finish/finish.component';
import { SelectBranchComponent } from './select-branch/select-branch.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanySetupComponent } from './company-setup/company-setup.component';
import { SetupComponent } from './setup/setup.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: SetupComponent, children: [
    { path: 'done', component: FinishComponent },
    { path: 'company', component: CompanySetupComponent },
    { path: 'select-branch', component: SelectBranchComponent },
    { path: 'company-detail', component: CompanyDetailComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
