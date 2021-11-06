import { Branch } from './../../models/branch';
import { Company } from './../../models/company';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetupService {
  localServerUrl = localStorage.getItem('local-server-url');

  constructor(private http: HttpClient) { }

  fetchCompanies() {
    return this.http.get<Company[]>(`${this.localServerUrl}/companies`);
  }

  fetchCompanyBranches() {
    const company: Company = JSON.parse(
      localStorage.getItem('branch-setup-company')
    );

    return this.http.get<Branch[]>(`${this.localServerUrl}/` +
    `companies/${company.id}/branches`)
  }

}
