import { Product } from './../models/product';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { StaffService } from 'src/app/services/staff.service';
import { EditProductQuantityDialogComponent } from '../edit-product-quantity-dialog/edit-product-quantity-dialog.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  productIdParam: string;

  isFetchingProduct: boolean;
  isErrorFetchingProduct: boolean;

  staffBranchId: string;
  showChangeNameForm: boolean;
  showChangePriceForm: boolean;

  hasEditProductRole: boolean;
  hasEditProductPriceRole: boolean;

  changeNameForm: FormGroup;
  isChangingProductName: boolean;
  changeNameNetworkErrorMessage: string;

  changePriceForm: FormGroup;
  isChangingProductPrice: boolean;
  changeProductPriceNetworkErrorMessage: string;

  constructor(
    private staffService: StaffService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private dialogOpener: MatDialog,
    private snackBar: MatSnackBar,
    private title: Title
  ) {
      this.staffBranchId = this.staffService.staff.branchId;
      if (this.staffService.staff.roles.find(role => role.id === 'edit-product')) {
        this.hasEditProductRole = true;
      }

      if (this.staffService.staff.roles.find(role => role.id === 'edit-product-price')) {
        this.hasEditProductPriceRole = true;
      }

      this.changeNameForm = new FormGroup({
        name: new FormControl()
      });

      this.changePriceForm = new FormGroup({
        costPrice: new FormControl(),
        sellingPrice: new FormControl()
      });
  }

  ngOnInit(): void {
    this.title.setTitle(`Product Details - Management System`);
    this.activatedRoute.params.subscribe(params => {
      this.productIdParam = params.id;
    });

    this.fetchProduct();
  }

  toggleChangeNameForm(): void {
    this.showChangeNameForm = !this.showChangeNameForm;
  }

  toggleChangePriceForm(): void {
    this.showChangePriceForm = !this.showChangePriceForm;
  }

  clearNameTextBox(): void {
    this.changeNameForm.patchValue({
      name: ''
    });
  }

  fetchProduct(): void {
    this.isFetchingProduct = true;
    this.isErrorFetchingProduct = false;

    this.staffService.fetchProduct(this.productIdParam)
    .subscribe(product => {
      this.title.setTitle(`${product.name} - Product Details`);
      this.isFetchingProduct = false;
      this.product = product;

      this.changePriceForm.patchValue({
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice
      });
    }, error => {
      this.isFetchingProduct = false;
      this.isErrorFetchingProduct = true;
      
      console.log(error);
    });
  }

  changeProductPrice(): void {
    if (this.changePriceForm.invalid) { return; }

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Want To Change Price?',
        message: 'The new price will affect the price of this product in all branches. ' +
        'Would you like to continue?',
        okButtonText: 'YES, CHANGE PRICE',
        cancelButtonText: 'DON\'T CHANGE'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      this.isChangingProductPrice = true;

      this.productService.changePrice(this.product.id, this.changePriceForm.value)
      .subscribe(product => {
        this.isChangingProductPrice = false;

        this.product.costPrice = product.costPrice;
        this.product.sellingPrice = product.sellingPrice;

        this.dialogOpener.open(OkDialogComponent, {
          data: {
            title: 'Price Updated',
            message: 'The price has been updated in all branches.',
            okButtonText: 'OK'
          }
        })
        .afterClosed()
        .subscribe(() => {
          this.showChangePriceForm = false;
        });
      }, error => {
        this.isChangingProductPrice = false;

        this.dialogOpener.open(OkCancelDialogComponent, {
          data: {
            title: 'Operation Failed',
            message: 'We were unable to change product price',
            okButtonText: 'TRY AGAIN',
            cancelButtonText: 'CLOSE DIALOG'
          }
        })
        .componentInstance
        .ok.subscribe(() => {
          this.changeProductPrice();
        });
        console.error(error);
      });
    });
  }

  changeProductName(): void {
    if (this.changeNameForm.invalid) { return; }

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Change Product Name?',
        message: 'This will change the name in all branches. ' +
        'Do you want to continue with this? ',
        okButtonText: 'YES, CONTINUE',
        cancelButtonText: 'NO, STOP'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      this.isChangingProductName = true;

      this.productService.changeName(this.product.id, this.changeNameForm.value.name)
      .subscribe(product => {
        this.showChangeNameForm = false;
        this.isChangingProductName = false;
        this.changeNameForm.reset();

        this.product.name = product.name;
        this.snackBar.open('Name Changed', 'CLOSE', {
          duration: 10000
        });
      }, error => {
        this.isChangingProductName = true;

        switch (error.status) {
          case 0: {
            this.changeNameNetworkErrorMessage =
              'Unable to connect. Check your network and try again.';
            break;
          }
          case 500: {
            this.changeNameNetworkErrorMessage = 'An unexpected error has occurred. ' +
            'Contact your admin if this keeps coming.';
            break;
          }
          default: {
            this.changeNameNetworkErrorMessage = 'An unknown error has occurred. ' +
            'Contact your admin if this keeps coming.';
          }
        }
        console.error(error);
      });
    });

  }

  editQuantity() {    
    this.dialogOpener.open(EditProductQuantityDialogComponent, {
      data: {
        product: this.product
      }
    })
    .componentInstance
    .updated
    .subscribe(product => {
      this.product.quantity = product.quantity;
    });
  }
}
