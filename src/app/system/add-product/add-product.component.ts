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
  lookedUpProducts: Product[];
  showLookedUpProductsWindow: boolean = true;

  constructor(
    private utilityService: UtilityService,
    private staffService: StaffService,
    private dialogOpener: MatDialog, 
    private matSnackBar: MatSnackBar) {
    this.form = new FormGroup({
      name: new FormControl(),
      quantity: new FormControl(),
      lookupKey: new FormControl(),
      unitPrice: new FormControl(),
      costPrice: new FormControl(),
      sellingPrice: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  goBack() {
    history.back();
  }

  lookupProduct(lookupKey: string) {
    this.showLookedUpProductsWindow = true;

    this.utilityService.lookupProduct(lookupKey)
    .subscribe(products => {
      this.lookedUpProducts = products;
    }, error => {
      console.log(error);
    });
  }

  selectLookedUpProduct(product: Product) {
    this.showLookedUpProductsWindow = false;

    this.form.patchValue({
      name: product?.name,
      lookupKey: product?.lookupKey,
      costPrice: product?.costPrice,
      sellingPrice: product?.sellingPrice
    });
  }

  saveProduct() {
    if (this.form.invalid) { return; }

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: "Add Product",
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

      this.staffService.createProduct(this.form.value)
      .subscribe(product => {
        dialogRef.close();
        this.form.reset();
        // localStorage.setItem('products', JSON.stringify(products));    
        this.matSnackBar.open('Product Added Successfully', 'CLOSE', {
          duration: 5000
        });
      }, error => {
        dialogRef.close();
        console.error(error);

        switch(error.status) {
          case 0: {
            break;
          }
          case 400: {
            this.dialogOpener.open(OkCancelDialogComponent, {
              data: {
                title: 'Product Already Exists',
                message: `${this.form.value['name']} is already in this branch. Edit product instead`,
                okButtonText: 'OK, EDIT',
                cancelButtonText: 'FORGET'
              }
            })
            .componentInstance
            .ok
            .subscribe(() => {

            })
            break;
          }
          case 500: {
            break;
          }
          default: {

          }
        }
      });
    })
    
  }

}
