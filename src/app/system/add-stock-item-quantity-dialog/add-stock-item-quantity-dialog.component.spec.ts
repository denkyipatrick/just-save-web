import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockItemQuantityDialogComponent } from './add-stock-item-quantity-dialog.component';

describe('AddStockItemQuantityDialogComponent', () => {
  let component: AddStockItemQuantityDialogComponent;
  let fixture: ComponentFixture<AddStockItemQuantityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStockItemQuantityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockItemQuantityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
