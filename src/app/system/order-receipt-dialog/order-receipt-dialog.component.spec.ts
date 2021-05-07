import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReceiptDialogComponent } from './order-receipt-dialog.component';

describe('OrderReceiptDialogComponent', () => {
  let component: OrderReceiptDialogComponent;
  let fixture: ComponentFixture<OrderReceiptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderReceiptDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
