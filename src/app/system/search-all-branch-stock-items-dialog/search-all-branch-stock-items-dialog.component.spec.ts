import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAllBranchStockItemsDialogComponent } from './search-all-branch-stock-items-dialog.component';

describe('SearchAllBranchStockItemsDialogComponent', () => {
  let component: SearchAllBranchStockItemsDialogComponent;
  let fixture: ComponentFixture<SearchAllBranchStockItemsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAllBranchStockItemsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAllBranchStockItemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
