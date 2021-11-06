import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCompanyComponent } from './find-company.component';

describe('FindCompanyComponent', () => {
  let component: FindCompanyComponent;
  let fixture: ComponentFixture<FindCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
