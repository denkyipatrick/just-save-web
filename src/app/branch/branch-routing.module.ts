import { ProductDetailsComponent } from './product-details/product-details.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductsComponent } from './products/products.component';
import { BranchComponent } from './branch.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BranchComponent, children: [
    { path: 'products', component: ProductsComponent },
    { path: 'products/:id', component: ProductDetailsComponent },
    { path: 'create-product', component: CreateProductComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
