import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, PermissionMatrix, CreateRoleRequest, UpdateRoleRequest } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/roles/${id}`);
  }

  getAccessMatrix(): Observable<PermissionMatrix[]> {
    return this.http.get<PermissionMatrix[]>(`${this.apiUrl}/roles/access-matrix`);
  }

  createRole(role: CreateRoleRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/roles`, role);
  }

  updateRole(id: string, role: UpdateRoleRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/roles/${id}`, role);
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/roles/${id}`);
  }
}

