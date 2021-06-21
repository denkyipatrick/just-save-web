import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockitemQuantityDialogComponent } from './edit-stockitem-quantity-dialog.component';

describe('EditStockitemQuantityDialogComponent', () => {
  let component: EditStockitemQuantityDialogComponent;
  let fixture: ComponentFixture<EditStockitemQuantityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockitemQuantityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockitemQuantityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
