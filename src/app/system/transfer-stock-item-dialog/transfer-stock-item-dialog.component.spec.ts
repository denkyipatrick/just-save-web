import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStockItemDialogComponent } from './transfer-stock-item-dialog.component';

describe('TransferStockItemDialogComponent', () => {
  let component: TransferStockItemDialogComponent;
  let fixture: ComponentFixture<TransferStockItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferStockItemDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferStockItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
