import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { BranchProduct } from './../../models/branchproduct';
import { BranchService } from './../services/branch.service';
import { EditProductQuantityDialogComponent } from './../edit-product-quantity-dialog/edit-product-quantity-dialog.component';
import { Product } from './../../models/product';
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

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  branchProduct: BranchProduct;
  productIdParam: string;

  isDeletingBranchProduct: boolean;
  isErrorDeletingBranchProduct: boolean;
  deleteBranchProductErrorMessage: string;

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
    private branchService: BranchService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private dialogOpener: MatDialog,
    private snackBar: MatSnackBar,
    private title: Title
  ) {
    // this.staffBranchId = this.staffService.staff.branchId;
    // if (this.staffService.staff.roles.find(role => role.id === 'edit-product')) {
    //   this.hasEditProductRole = true;
    // }

    // if (this.staffService.staff.roles.find(role => role.id === 'edit-product-price')) {
    //   this.hasEditProductPriceRole = true;
    // }

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

    this.branchService.fetchBranchProduct(this.productIdParam)
    .subscribe(branchProduct => {
      this.title.setTitle(`${branchProduct?.product.name} - Product Details`);
      this.isFetchingProduct = false;
      this.branchProduct = branchProduct;

      this.changePriceForm.patchValue({
        costPrice: branchProduct?.product.costPrice,
        sellingPrice: branchProduct?.product.sellingPrice
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

      this.productService.changePrice(this.branchProduct?.product.id, this.changePriceForm.value)
      .subscribe(product => {
        this.isChangingProductPrice = false;

        this.branchProduct.product.costPrice = product.costPrice;
        this.branchProduct.product.sellingPrice = product.sellingPrice;

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

      this.productService.changeName(this.branchProduct?.product.id, this.changeNameForm.value.name)
      .subscribe(product => {
        this.showChangeNameForm = false;
        this.isChangingProductName = false;
        this.changeNameForm.reset();

        this.branchProduct.product.name = product.name;
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

  deleteProduct(){
    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Delete Product?',
        message: `Do you want to delete ${this.branchProduct.product.name}. ` + 
        `You cannot undo this action.`
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      this.isDeletingBranchProduct = true;
      this.isErrorDeletingBranchProduct = false;
      this.deleteBranchProductErrorMessage = '';

      const pleaseWaitDialog = this.dialogOpener.open(
        PleaseWaitDialogComponent);

      this.branchService.deleteBranchProduct(this.branchProduct.id)
      .subscribe(() => {
        pleaseWaitDialog.close();
        this.isDeletingBranchProduct = false;

        this.dialogOpener.open(OkDialogComponent, {
          data: {
            title: this.branchProduct.product.name + ' Deleted',
            message: `You have successfully deleted ` + 
            `${this.branchProduct.product.name}`
          }
        });
      }, error => {
        pleaseWaitDialog.close();
        this.isDeletingBranchProduct = false;
        this.isErrorDeletingBranchProduct = true;

        switch(error.status) {
          case 0:
            this.deleteBranchProductErrorMessage = 
              'You may be offline, please check your network and try again.';
            break;
          case 500:
            this.deleteBranchProductErrorMessage = 'Unexpected Error occurred.'
          break;
          default: 
            this.deleteBranchProductErrorMessage = 
              'An unknown error has occurred, please try again later.';
        }
      });
    });
  }

  editQuantity() {
    this.dialogOpener.open(EditProductQuantityDialogComponent, {
      data: {
        branchProduct: this.branchProduct
      }
    })
    .componentInstance
    .updated
    .subscribe(branchProduct => {
      this.branchProduct.quantity = branchProduct.quantity;
    });
  }
}
