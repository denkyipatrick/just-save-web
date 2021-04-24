import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { CompanyService } from './../../services/company.service';
import { BranchService } from './../../services/branch.service';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from './../../services/utility.service';
import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { StaffService } from './../../services/staff.service';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { Product } from './../../models/product';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  form: FormGroup;

  stockId: string = '';
  lookedUpProducts: Product[];
  showLookedUpProductsWindow = true;

  constructor(
    private utilityService: UtilityService,
    private companyService: CompanyService,
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    private matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private branchService: BranchService
    ) {
    this.form = new FormGroup({
      name: new FormControl(),
      stockId: new FormControl(),
      quantity: new FormControl(),
      lookupKey: new FormControl(),
      unitPrice: new FormControl(),
      costPrice: new FormControl(),
      sellingPrice: new FormControl()
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stockId = params['id']
      this.form.patchValue({stockId: params['id']});
    });
  }

  goBack(): void {
    history.back();
  }

  lookupProduct(lookupKey: string): void {
    this.showLookedUpProductsWindow = true;

    this.companyService.lookupProduct(lookupKey)
    .subscribe(products => {
      this.lookedUpProducts = products;
    }, error => {
      console.log(error);
    });
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

      this.branchService.createBranchStockItem(this.form.value)
      .subscribe(product => {
        dialogRef.close();
        // this.form.reset();
        // localStorage.setItem('products', JSON.stringify(products));
        this.matSnackBar.open('Product Added Successfully', 'CLOSE', {
          duration: 5000
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
