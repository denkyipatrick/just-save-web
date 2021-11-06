import { ChooseBranchComponent } from './choose-branch/choose-branch.component';
import { FindCompanyComponent } from './find-company/find-company.component';
import { FinishComponent } from './finish/finish.component';
import { SelectBranchComponent } from './select-branch/select-branch.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanySetupComponent } from './company-setup/company-setup.component';
import { SetupComponent } from './setup.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterUrlComponent } from './enter-url/enter-url.component';

const routes: Routes = [
  { path: '', component: SetupComponent, children: [
    { path: 'done', component: FinishComponent },
    { path: 'company', component: CompanySetupComponent },
    { path: 'enter-url', component: EnterUrlComponent },
    { path: 'find-company', component: FindCompanyComponent },
    { path: 'choose-branch', component: ChooseBranchComponent },
    { path: 'select-branch', component: SelectBranchComponent },
    { path: 'company-detail', component: CompanyDetailComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
