import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Navbar } from '../../shared/navbar/navbar';
import { UserService } from '../../../services/user';
import { RoleService } from '../../../services/role.service';
import { AuthService } from '../../../services/auth.service';
import { SidebarService } from '../../../services/sidebar.service';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  editingUserId: string | null = null;
  editingRoleId: string | null = null;
  loading = false;
  saving = false;
  sidebarOpen = true;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });

    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }
  saveEditedUser() {
    const user = this.users.find(u => u.id === this.editingUserId);
  
    if (!user) {
      return; // safety check
    }
  
    this.saveRole(user);
  }
  

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
      },
      error: (err: any) => {
        console.error('Error loading roles:', err);
      }
    });
  }

  startEdit(user: User) {
    this.editingUserId = user.id;
    this.editingRoleId = user.role._id;
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editingRoleId = null;
  }

  saveRole(user: User) {
    if (!this.editingRoleId) return;

    this.saving = true;
    this.userService.updateUserRole(user.id, this.editingRoleId).subscribe({
      next: () => {
        this.loadUsers();
        this.editingUserId = null;
        this.editingRoleId = null;
        this.saving = false;
      },
      error: (err: any) => {
        console.error('Error updating user role:', err);
        alert('Failed to update user role');
        this.saving = false;
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  getInitials(fullName: string): string {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
}
