import { DialogModule } from './../../dialog/dialog.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialComponentsModule } from './../../material-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { CustomComponentsModule } from 'src/app/custom-components/custom-components.module';
import { PersonalComponent } from './personal/personal.component';
import { SecurityComponent } from './security/security.component';


@NgModule({
  declarations: [
    SettingsComponent,
    PersonalComponent,
    SecurityComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    CustomComponentsModule,
    MaterialComponentsModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
