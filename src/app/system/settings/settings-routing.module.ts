import { SecurityComponent } from './security/security.component';
import { PersonalComponent } from './personal/personal.component';
import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: SettingsComponent, children: [
    { path: 'personal', component: PersonalComponent },
    { path: 'security', component: SecurityComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
