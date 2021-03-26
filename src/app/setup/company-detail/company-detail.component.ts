import { Company } from './../../models/company';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  company: Company;

  constructor() {
    this.company = JSON.parse(localStorage.getItem('company'));
  }

  ngOnInit(): void {
  }

}
