import { RoutesService } from './routes.service';
import { Observable } from 'rxjs';
import { CompanyService } from './company.service';
import { Product } from './../models/product';
import { Role } from './../models/role';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from '../models/branch';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  appName = 'Zoma and Sons Bicycle Parts';
  appSlogan = 'Manage and sell bicycle parts';

  constructor(
    private routesService: RoutesService,
    private companyService: CompanyService,
    private http: HttpClient) {
    this.appSlogan = 'Store Management System';
    this.appName = this.companyService.company?.name;
    this.appSlogan = 'System Slogan';
  }

  fetchSystemRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.routesService.ROLES_URL}`);
  }

  fetchBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.routesService.BRANCHES_URL}`);
  }
}
