import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockEntriesComponent } from './stock-entries.component';

describe('StockEntriesComponent', () => {
  let component: StockEntriesComponent;
  let fixture: ComponentFixture<StockEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockEntriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
