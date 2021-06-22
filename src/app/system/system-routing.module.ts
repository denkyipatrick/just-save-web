import { DailySalesDetailComponent } from './daily-sales-detail/daily-sales-detail.component';
import { CurrentStockComponent } from './current-stock/current-stock.component';
import { StockEntryDetailComponent } from './stock-entry-detail/stock-entry-detail.component';
import { StockEntriesComponent } from './stock-entries/stock-entries.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { StockComponent } from './stock/stock.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersComponent } from './orders/orders.component';
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
    { path: 'orders', component: OrdersComponent },
    { path: 'orders/:orderId', component: OrderDetailComponent },
    { path: 'daily-sales', component: OrdersComponent },
    { path: 'daily-sales/:date', component: DailySalesDetailComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'new-order', component: NewOrderComponent },
    { path: 'stocks', component: StockComponent },
    { path: 'stock-history', component: StockComponent },
    { path: 'stock-history/:id', component: StockDetailComponent },
    { path: 'current-stock', component: CurrentStockComponent },
    { path: 'stocks/:id', component: StockDetailComponent },
    { path: 'stock-entries', component: StockEntriesComponent },
    { path: 'stock-entries/:id', component: StockEntryDetailComponent },
    { path: 'stocks/:id/add-product', component: AddProductComponent },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
