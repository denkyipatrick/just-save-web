import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderInsufficientOrderItemsDialogComponent } from './new-order-insufficient-order-items-dialog.component';

describe('NewOrderInsufficientOrderItemsDialogComponent', () => {
  let component: NewOrderInsufficientOrderItemsDialogComponent;
  let fixture: ComponentFixture<NewOrderInsufficientOrderItemsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOrderInsufficientOrderItemsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderInsufficientOrderItemsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
