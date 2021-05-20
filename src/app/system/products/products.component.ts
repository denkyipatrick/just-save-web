import { MatDialog } from '@angular/material/dialog';
import { StockItem } from './../../models/stockitem';
import { SearchableBranchStockItem } from './../../models/searchablebranchstockitem';
import { Stock } from './../../models/stock';
import { BranchService } from './../../services/branch.service';
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

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  searchKey: string;
  staff: Staff;

  activeStock: Stock;

  isRefreshing: boolean = false;
  isFetchingProducts: boolean;
  isErrorFetchingProducts: boolean;

  isShowMultipleBranches: boolean;
  canStaffCreateProduct: boolean;

  tableColumns: string[] = ['name', 'sellingPrice', 'quantity', 'actions'];
  // tableColumns: string[] = [
  //   'key', 'name', 'sellingPrice', 'quantity'
  // ]
  
  dataSource: MatTableDataSource<SearchableBranchStockItem>;

  @Output() productSelected: EventEmitter<Product>

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialogOpener: MatDialog,
    private staffService: StaffService,
    private branchService: BranchService,
    private companyService: CompanyService,
    private router: Router, private route: ActivatedRoute
  ) {
    this.staff = this.staffService.staff;
    this.searchKey = sessionStorage.getItem('search-key');
    this.isShowMultipleBranches = JSON.parse(localStorage.getItem('show-products-from-all-branches'));

    this.canStaffCreateProduct = this.staffService.staff.roles
      .find(role => role.id === 'add-product') ? true : false;

    this.productSelected = new EventEmitter();
    this.activeStock = JSON.parse(sessionStorage.getItem('active-stock'));
    // this.products = JSON.parse(sessionStorage.getItem('products'));
  }

  ngOnInit(): void {
    if (this.activeStock) {
      this.setupPaginator();

      if (this.searchKey) {
        return this.searchProduct(this.searchKey);
      }

      this.refreshProducts();
      return;
    }
    
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
    this.router.navigate(['./', searchableBranchStockItem.productId], { relativeTo: this.route });
  }

  searchProduct(query: string): void {
    this.dataSource.filter = query;
    sessionStorage.setItem('search-key', query);
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
    this.fetchBranchProducts();
  }

  fetchBranchProducts(): void {
    if (!this.isRefreshing) {
      this.isFetchingProducts = true;
    }

    this.isErrorFetchingProducts = false;

    this.branchService.fetchActiveStock(this.staffService.staff.staffBranch.branch.id)
    .subscribe(stock => {
      this.activeStock = stock;
      this.isRefreshing = false;
      this.isFetchingProducts = false;
      this.setupPaginator();
      sessionStorage.setItem('active-stock', JSON.stringify(this.activeStock));
    
    }, error => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;
    });
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
