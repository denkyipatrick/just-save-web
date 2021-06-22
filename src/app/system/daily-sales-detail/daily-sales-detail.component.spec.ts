import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySalesDetailComponent } from './daily-sales-detail.component';

describe('DailySalesDetailComponent', () => {
  let component: DailySalesDetailComponent;
  let fixture: ComponentFixture<DailySalesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySalesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySalesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
