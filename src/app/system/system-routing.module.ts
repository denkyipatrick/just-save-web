import { NewOrderComponent } from './new-order/new-order.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { BranchesComponent } from './branches/branches.component';
import { CreateBranchComponent } from './create-branch/create-branch.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AddProductComponent } from './add-product/add-product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { SystemComponent } from './system.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: SystemComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersComponent },
    { path: 'staff', component: StaffListComponent },
    { path: 'staff/:username', component: StaffDetailComponent },
    { path: 'add-staff', component: AddStaffComponent },
    { path: 'branches', component: BranchesComponent },
    { path: 'create-branch', component: CreateBranchComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'new-order', component: NewOrderComponent },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
