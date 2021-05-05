import { Stock } from 'src/app/models/stock';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { CompanyService } from './../../services/company.service';
import { BranchService } from './../../services/branch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from './../../services/utility.service';
import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { StaffService } from './../../services/staff.service';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { Product } from './../../models/product';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ThreeButtonDialogComponent } from '../three-button-dialog/three-button-dialog.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  form: FormGroup;

  existingProducts: Product[];
  lookedUpProducts: Product[];
  showLookedUpProductsWindow = true;

  constructor(
    private companyService: CompanyService,
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    private matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.form = new FormGroup({
      name: new FormControl(),
      companyId: new FormControl(this.companyService.company.id),
      lookupKey: new FormControl(),
      unitPrice: new FormControl(),
      costPrice: new FormControl(),
      sellingPrice: new FormControl()
    });

    this.existingProducts = JSON.parse(sessionStorage.getItem('products')) || [];
  }

  ngOnInit(): void {
  }

  goBack(): void {
    history.back();
  }

  lookupProduct(lookupKey: string): void {
    this.showLookedUpProductsWindow = true;

    this.lookedUpProducts = this.existingProducts
      .filter(product => product.lookupKey.toLowerCase()
      .indexOf(lookupKey.toLowerCase()) > -1);
  }

  selectLookedUpProduct(product: Product): void {
    this.showLookedUpProductsWindow = false;

    this.form.patchValue({
      name: product?.name,
      lookupKey: product?.lookupKey,
      costPrice: product?.costPrice,
      sellingPrice: product?.sellingPrice
    });
  }

  saveProduct(): void {
    if (this.form.invalid) { return; }

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Add Product',
        message: 'Are you sure you want to add this product to your store?',
        okButtonText: 'YES',
        cancelButtonText: 'NO'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
        disableClose: true
      });

      this.companyService.createProduct(this.form.value)
      .subscribe(product => {
        dialogRef.close();

        const products: Product[] = JSON.parse(sessionStorage.getItem('products')) || [];
        products.push(product);
        
        sessionStorage.setItem('products', JSON.stringify(products));

        const dialogRef2 = this.dialogOpener.open(ThreeButtonDialogComponent, {
          data: {
            title: 'Product Added Successfully',
            message: `You have successfully created ${product?.name || 'the product.'} ` + 
            `You can view its details, create a new product or view all products.`,
            option1ButtonText: 'VIEW PRODUCTS',
            option2ButtonText: 'ADD NEW',
            option3ButtonText: 'VIEW'
          }
        })
        .componentInstance;

        dialogRef2.option1
        .subscribe(() => {
          this.router.navigate(['/system/products/'], { relativeTo: this.route });
        });
        
        dialogRef2.option2
        .subscribe(() => {
          this.form.markAsUntouched();
          this.form.reset();
        });
        
        dialogRef2.option3
        .subscribe(() => {
          this.router.navigate(['/system/products/', product.id], { relativeTo: this.route });
        });
      }, error => {
        dialogRef.close();
        console.error(error);

        switch (error.status) {
          case 0: {
            break;
          }
          case 400: {
            this.dialogOpener.open(OkDialogComponent, {
              data: {
                title: 'Product Already Part of This Stock',
                message: `${this.form.value.name} is already added to this stock.`,
                okButtonText: 'OK'
              }
            });
            break;
          }
          case 500: {
            break;
          }
          default: {

          }
        }
      });
    });

  }

}
