import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';

const modules = [
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatToolbarModule,
  MatFormFieldModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialComponentsModule { }
