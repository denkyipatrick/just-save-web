import { Stock } from './../../models/stock';
import { SearchableBranchProduct } from './../../models/searchablebranchproduct';
import { MatTableDataSource } from '@angular/material/table';
import { BranchProduct } from './../../models/branchproduct';
import { BranchService } from './../../services/branch.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductListComponent } from './../product-list/product-list.component';
import { NewOrderInsufficientOrderItemsDialogComponent } from './../new-order-insufficient-order-items-dialog/new-order-insufficient-order-items-dialog.component';
import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { CompanyService } from './../../services/company.service';
import { StaffService } from './../../services/staff.service';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { CartItem } from './../../models/cartitem';
import { SelectOrderProductQuantityDialogComponent } from './../select-order-product-quantity-dialog/select-order-product-quantity-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Product } from './../../models/product';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {
  @Output() editProductQuantity: EventEmitter<null>;

  activeStock: Stock;
  branchProducts: BranchProduct[];
  cartItems: CartItem[];
  selectedCartItemIdMenu: string;

  tableColumns: string[] = ['key', 'name', 'quantity', 'sellingPrice'];
  dataSource: MatTableDataSource<SearchableBranchProduct>;

  orderTotalAmount: number;
  isShowProducts: boolean;
  totalSelectedItems: number;
  showOrCollapseProductsButtonText: string;

  @ViewChild(ProductListComponent)
  productListComponent: ProductListComponent;

  constructor(
    private companyService: CompanyService,
    private staffService: StaffService,
    private branchService: BranchService,
    private dialogOpener: MatDialog,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.editProductQuantity = new EventEmitter();

    this.orderTotalAmount = 0;
    this.totalSelectedItems = 0;
    // this.branchProducts = JSON.parse(sessionStorage.getItem('branch-products'));

    this.cartItems = JSON.parse(sessionStorage.getItem('cart-items')) || [];
    this.isShowProducts = JSON.parse(localStorage.getItem('show-products'));
    this.showOrCollapseProductsButtonText = this.isShowProducts ? 'Hide Products' : 'Show Products';
    
    this.getOrderTotalAmount();
  }

  ngOnInit(): void {
    // this.branchService.fetchProducts(this.staffService.staff.staffBranch.branch.id)
    // .subscribe(branchProducts => {
    //   this.branchProducts = branchProducts;
    //   this.setupDataSource();

    //   console.log(branchProducts);
    // });

    this.branchService.fetchActiveStock(this.staffService.staff.staffBranch.branch.id)
    .subscribe(activeStock => {
      this.activeStock = activeStock;
      this.setupDataSource();
      console.log(activeStock);
    });
  }

  setupDataSource() {
    const searchableBranchProducts: SearchableBranchProduct[] = [];

    // this.branchProducts.forEach(branchProduct => {
    //   searchableBranchProducts.push(
    //     new SearchableBranchProduct(
    //       branchProduct.product.lookupKey,
    //       branchProduct.product.name,
    //       branchProduct.product.sellingPrice,
    //       branchProduct.quantity
    //     )
    //   )
    // });

    this.activeStock.items.forEach(item => {
      searchableBranchProducts.push(
        new SearchableBranchProduct(
          item.product.lookupKey,
          item.product.name,
          item.product.sellingPrice,
          item.availableQuantity
        )
      )
    });

    this.dataSource = new MatTableDataSource(searchableBranchProducts);

  }

  ngAfterViewInit() {}

  toggleProducts() {
    this.isShowProducts = !this.isShowProducts;
    localStorage.setItem('show-products', JSON.stringify(this.isShowProducts));
    this.showOrCollapseProductsButtonText = this.isShowProducts ? 'Hide Products' : 'Show Products';
  }

  searchProduct(query: string) {
    this.dataSource.filter = query;
  }

  deleteCartItem(item: CartItem) {
    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: "Remove Item",
        message: "Remove item from order items?",
        okButtonText: 'REMOVE',
        cancelButtonText: 'CANCEL'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
      this.getOrderTotalAmount();

      sessionStorage.setItem('cart-items', JSON.stringify(this.cartItems));
    });
  }

  getOrderTotalAmount() {
    this.orderTotalAmount = 0;

    this.cartItems.forEach(item => {
      this.orderTotalAmount += item.quantity * item.soldPrice;
    });
  }

  cartItemChangeQuantityMenuSelected(itemId: string) {
    this.productListComponent?.onEditProductQuantity(itemId);
  }

  closeQuantityDialog() {
    this.selectedCartItemIdMenu = null;
  }

  onProductSelected(searchableProduct: SearchableBranchProduct) {
    const item = this.activeStock.items.find(stockItem => stockItem.product.lookupKey ===
      searchableProduct.productLookupKey)

    this.dialogOpener.open(SelectOrderProductQuantityDialogComponent, {
      disableClose: true,
      data: {
        stockItem: item
      }
    })
    .componentInstance
    .accept
    .subscribe(newItem => {
      this.dataSource.filter = '';

      for(const cartItem of this.cartItems) {
        if (cartItem.id === newItem.id) {
          cartItem.quantity = newItem.quantity;
          cartItem.soldPrice = newItem.soldPrice;
          this.getOrderTotalAmount();
          sessionStorage.setItem('cart-items', JSON.stringify(this.cartItems));
          return;
        }
      }

      this.cartItems.push(newItem);
      this.getOrderTotalAmount();

      sessionStorage.setItem('cart-items', JSON.stringify(this.cartItems));
    });
  }

  startOrder() {
    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Start Order',
        message: 'Please confirm your intentions to ' + 
        'make a new order.',
        okButtonText: 'START ORDER',
        cancelButtonText: 'CANCEL'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      const waitDialogRef = this.dialogOpener.open(PleaseWaitDialogComponent);

      const cartItems = this.cartItems.map(cartItem => {
        delete cartItem.id;
        delete cartItem.stockItem;

        return cartItem;
      });

      this.staffService.startOrder({
        items: cartItems,
        stockId: this.activeStock.id,
        staffId: this.staffService.staff.id,
        branchId: this.staffService.staff.branchId,
        companyId: this.companyService.company.id
      })
      .subscribe(order => {
        waitDialogRef.close();
        
        this.cartItems = [];
        sessionStorage.removeItem('cart-items');

        this.dialogOpener.open(OkDialogComponent, {
          disableClose: true,
          data: {
            title: 'Order Completed',
            message: 'Your order has been completed successfully.',
            okButtonText: 'FINISH'
          }
        })
        .componentInstance
        .ok
        .subscribe(() => {
          sessionStorage.setItem('target-order', JSON.stringify(order));
          this.router.navigate(['../orders', order.id], { relativeTo: this.route });
        });
      }, error => {
        waitDialogRef.close();
        console.log(error.error);

        switch(error.status) {
          case 400: {
            this.dialogOpener.open(NewOrderInsufficientOrderItemsDialogComponent, {
              data: {
                items: error.error.items,
                title: 'Order Aborted',
                message: 'Some of the items you have selected does not have the specified quantities.',
                okButtonText: 'CLOSE'
              }
            });
            break;
          }
          case 500: {
            this.dialogOpener.open(OkDialogComponent, {
              data: {
                title: 'Order Failed',
                message: 'Your order has not been completed.',
                okButtonText: 'CLOSE'
              }
            });
          }
        }
      });
    });
  }

}
