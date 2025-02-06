import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/users';
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);

  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  //add get profile
  getProfile(): Observable<any> {
    this.loadingService.show();
    const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
    return this.http.get(`${this.apiUrl}/profile`, { headers })
      .pipe(finalize(() => this.loadingService.hide()));
  }

  //add get Employee by id 
  getEmployeeById(id: string): Observable<any> {
    this.loadingService.show();
    return this.http.get(`${this.apiUrl}/${id}`).pipe(finalize(() => this.loadingService.hide()));
  }

  // addEmployee(employee: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}`, employee);
  // }

  // updateEmployee(id: string, employee: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, employee);
  // }

  // deleteEmployee(id: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }

}
