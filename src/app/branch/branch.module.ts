import { BackButtonModule } from './../back-button/back-button.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListModule } from './../product-list/product-list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { DialogModule } from '../dialog/dialog.module';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditProductQuantityDialogComponent } from './edit-product-quantity-dialog/edit-product-quantity-dialog.component';


@NgModule({
  declarations: [
    BranchComponent,
    ProductsComponent,
    CreateProductComponent,
    ProductDetailsComponent,
    EditProductQuantityDialogComponent
  ],
  imports: [
    CommonModule,
    BackButtonModule,
    ProductListModule,
    BranchRoutingModule,
    ReactiveFormsModule,
    DialogModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatInputModule,
    MatMenuModule,
    DialogModule,
    MatSortModule,
    MatChipsModule,
    MatSelectModule,
    MatDialogModule,
    MatRippleModule,
    MatSnackBarModule,
    MatExpansionModule,
  ]
})
export class BranchModule { }
