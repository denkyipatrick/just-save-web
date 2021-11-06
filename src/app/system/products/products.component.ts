import { SearchableProduct } from './../../models/searchableproduct';
import { BranchProduct } from './../../models/branchproduct';
import { MatDialog } from '@angular/material/dialog';
import { StockItem } from './../../models/stockitem';
import { SearchableBranchStockItem } from './../../models/searchablebranchstockitem';
import { Stock } from './../../models/stock';
import { BranchService } from './../services/branch.service';
import { Staff } from 'src/app/models/staff';
import { CompanyService } from './../../services/company.service';
import { StaffService } from './../../services/staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './../../models/product';
import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SearchAllBranchStockItemsDialogComponent } from '../search-all-branch-stock-items-dialog/search-all-branch-stock-items-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  // WHETHER THIS IS RUNNING ON A LOCAL NETWORK
  isBranchBuild = environment.isBranchBuild;

  products: Product[] = [];
  searchKey: string;
  staff: Staff;

  activeStock: Stock;

  isRefreshing: boolean = false;
  isFetchingProducts: boolean;
  isErrorFetchingProducts: boolean;

  isShowMultipleBranches: boolean;
  canStaffCreateProduct: boolean;
  tableColumns: string[] = ['name', 'sellingPrice', 'quantity'];
  
  dataSource: MatTableDataSource<SearchableBranchStockItem>;
  localBranchDataSource: MatTableDataSource<SearchableProduct>;

  @Output() productSelected: EventEmitter<Product>

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialogOpener: MatDialog,
    private staffService: StaffService,
    private companyService: CompanyService,
    private branchService: BranchService,
    private router: Router, private route: ActivatedRoute
  ) {
    this.staff = this.staffService.staff;
    this.searchKey = sessionStorage.getItem('search-key') || '';
    this.isShowMultipleBranches = JSON.parse(
      localStorage.getItem('show-products-from-all-branches')
    );

    this.canStaffCreateProduct = true 
    // this.staffService.staff.roles
    //   .find(role => role.id === 'add-product') ? true : false;

    this.productSelected = new EventEmitter();
    this.activeStock = JSON.parse(sessionStorage.getItem('active-stock'));
  }

  ngOnInit(): void {
    console.log(this.isBranchBuild);
    // if (this.activeStock) {
    //   this.setupPaginator();

    //   if (this.searchKey) {
    //     return this.searchProduct(this.searchKey);
    //   }

    //   this.refreshProducts();
    //   return;
    // }
    
    this.fetchProducts();
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  refreshProducts() {
    this.isRefreshing = true;
    this.fetchProducts();
  }

  searchAllBranches() {
    this.dialogOpener.open(SearchAllBranchStockItemsDialogComponent)
  }

  setupPaginator() {
    const searchableStockItems: SearchableBranchStockItem[] = [];

    this.activeStock?.items?.forEach(stockItem => {
      searchableStockItems.push(
        new SearchableBranchStockItem(
          stockItem.product.lookupKey,
          stockItem.product.id,
          stockItem.product.name,
          stockItem.availableQuantity,
          stockItem.product.sellingPrice
        )
      )
    });

    this.dataSource = new MatTableDataSource(searchableStockItems);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.searchProduct(this.searchKey);
  }

  viewProduct(searchableBranchStockItem: SearchableBranchStockItem): void {
    this.router.navigate(
      ['./', searchableBranchStockItem.productId],
      { relativeTo: this.route }
    );
  }
  
  viewLocalBuildProduct(productId: any): void {
    this.router.navigate(
      ['./', productId],
      { relativeTo: this.route }
    );
  }

  searchProduct(query: string): void {
    this.isBranchBuild ? this.searchLocalBuildProduct(query) : 
      this.searchOnlineBuildProduct(query);
    
    sessionStorage.setItem('search-key', query);
  }

  searchLocalBuildProduct(query: string): void {
    this.localBranchDataSource.filter = query;
  }
  
  searchOnlineBuildProduct(query: string): void {
    this.localBranchDataSource.filter = query;
  }

  clearSearchField(input: HTMLInputElement) {
    input.value = "";
    this.searchKey = "";
    this.searchProduct('');
    sessionStorage.removeItem('search-key');
  }

  toggleShowMultipleBranches(): void {
    this.isShowMultipleBranches = !this.isShowMultipleBranches;
    this.fetchProducts();

    localStorage.setItem('show-products-from-all-branches',
      JSON.stringify(this.isShowMultipleBranches));
  }

  fetchProducts(): void {
    if (!this.isRefreshing) {
      this.isFetchingProducts = true;
    }

    this.isErrorFetchingProducts = false;

    this.branchService.fetchProducts()
    .subscribe(branchProducts => {
      const searchableProducts = branchProducts.map(branchProduct => {
        return new SearchableProduct(
          branchProduct.id,
          branchProduct.product.lookupKey,
          branchProduct.product.name,
          branchProduct.product.sellingPrice,
          branchProduct.quantity
        );
      });

      this.localBranchDataSource = 
      new MatTableDataSource(searchableProducts);
      this.localBranchDataSource.paginator = this.paginator;
      this.localBranchDataSource.sort = this.sort;

      // if (environment.isBranchBuild) {
      //   this.localBranchDataSource = 
      //     new MatTableDataSource(branchProducts);
        
      //   this.localBranchDataSource.paginator = this.paginator;
      //   this.localBranchDataSource.sort = this.sort;
      // }
      // console.log(branchProducts);

      // this.activeStock = stock;
      this.isRefreshing = false;
      this.isFetchingProducts = false;
      // this.setupPaginator();
      // sessionStorage.setItem('active-stock', JSON.stringify(this.activeStock));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;
    });
  }

  fetchBranchProducts(): void {
    if (!this.isRefreshing) {
      this.isFetchingProducts = true;
    }

    this.isErrorFetchingProducts = false;

    // this.branchService.fetchActiveStock(this.staffService.staff.staffBranch.branch.id)
    // .subscribe(stock => {
    //   this.activeStock = stock;
    //   this.isRefreshing = false;
    //   this.isFetchingProducts = false;
    //   this.setupPaginator();
    //   sessionStorage.setItem('active-stock', JSON.stringify(this.activeStock));
    
    // }, error => {
    //   this.isRefreshing = false;
    //   this.isFetchingProducts = false;
    // });
  }

  fetchCompanyProducts(): void {
    if (!this.isRefreshing) {
      this.isFetchingProducts = true;
    }

    this.isErrorFetchingProducts = false;

    this.companyService.fetchCompanyProducts()
    .subscribe(products => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;

      this.products = products;
      this.setupPaginator();
      this.dataSource.paginator = this.paginator;
      sessionStorage.setItem('products', JSON.stringify(products));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;
      this.isErrorFetchingProducts = true;
    });
  }

  deleteProduct(product: Product, event: Event): void {
    event.stopPropagation();
  }

}
