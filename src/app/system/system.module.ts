import { LoaderModule } from './../loader/loader.module';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffModule } from './staff/staff.module';
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
import { MatPaginatorModule } from '@angular/material/paginator';

import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../dialog/dialog.module';
import { BranchesComponent } from './branches/branches.component';
import { CreateBranchComponent } from './create-branch/create-branch.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { EditRoleDialogComponent } from './edit-role-dialog/edit-role-dialog.component';
import { CustomComponentsModule } from '../custom-components/custom-components.module';
import { NewOrderComponent } from './new-order/new-order.component';
import { EditProductQuantityDialogComponent } from './edit-product-quantity-dialog/edit-product-quantity-dialog.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SelectOrderProductQuantityDialogComponent } from './select-order-product-quantity-dialog/select-order-product-quantity-dialog.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NewOrderInsufficientOrderItemsDialogComponent } from './new-order-insufficient-order-items-dialog/new-order-insufficient-order-items-dialog.component';
import { StockComponent } from './stock/stock.component';
import { CreateStockDialogComponent } from './create-stock-dialog/create-stock-dialog.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';

@NgModule({
  declarations: [
    SystemComponent,
    DashboardComponent,
    ProductsComponent,
    UsersComponent,
    UserDetailComponent,
    ProductDetailComponent,
    AddProductComponent,
    StaffListComponent,
    AddStaffComponent,
    BranchesComponent,
    CreateBranchComponent,
    BranchListComponent,
    StaffDetailComponent,
    EditRoleDialogComponent,
    NewOrderComponent,
    EditProductQuantityDialogComponent,
    ProductListComponent,
    SelectOrderProductQuantityDialogComponent,
    OrdersComponent,
    OrderDetailComponent,
    NewOrderInsufficientOrderItemsDialogComponent,
    StockComponent,
    CreateStockDialogComponent,
    StockDetailComponent
  ],
  imports: [
    CommonModule,
    StaffModule,
    LoaderModule,
    CustomComponentsModule,
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
    MatInputModule,
    DialogModule,
    MatSortModule,
    MatChipsModule,
    MatSelectModule,
    MatDialogModule,
    MatRippleModule,
    MatSnackBarModule,
    MatExpansionModule,
    ReactiveFormsModule,
    SystemRoutingModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ]
})
export class SystemModule { }
