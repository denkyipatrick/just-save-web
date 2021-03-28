import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductQuantityDialogComponent } from './edit-product-quantity-dialog.component';

describe('EditProductQuantityDialogComponent', () => {
  let component: EditProductQuantityDialogComponent;
  let fixture: ComponentFixture<EditProductQuantityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductQuantityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductQuantityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
