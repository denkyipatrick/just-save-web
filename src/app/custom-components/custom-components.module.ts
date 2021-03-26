import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BackButtonComponent } from './back-button/back-button.component';

@NgModule({
  declarations: [
    BackButtonComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    BackButtonComponent
  ]
})
export class CustomComponentsModule { }
