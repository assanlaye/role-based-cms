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
    if (!this.hasPermission('edit')) {
      return;
    }
    
    const userId = (user as any).id || (user as any)._id;
    this.editingUserId = userId;
    this.editingRoleId = user.role._id;
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editingRoleId = null;
  }

  saveEditedUser() {
    if (!this.editingUserId || !this.editingRoleId) {
      return;
    }

    // Find user by id (handle both id and _id for compatibility)
    const user = this.users.find(u => {
      const userId = (u as any).id || (u as any)._id;
      return userId === this.editingUserId;
    });

    if (!user) {
      return;
    }

    const userId = (user as any).id || (user as any)._id;
    this.saving = true;
    this.userService.updateUserRole(userId, this.editingRoleId).subscribe({
      next: () => {
        this.loadUsers();
        this.cancelEdit();
        this.saving = false;
      },
      error: (err: any) => {
        console.error('Error updating user role:', err);
        alert(err.error?.message || 'Failed to update user role');
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

  getUserId(user: User): string {
    return (user as any).id || (user as any)._id || '';
  }

  isEditing(user: User): boolean {
    return this.editingUserId === this.getUserId(user);
  }

  deleteUser(user: User) {
    if (!this.hasPermission('delete')) {
      return;
    }

    const userId = this.getUserId(user);
    const currentUser = this.authService.getCurrentUser();
    const currentUserId = currentUser ? (currentUser as any).id || (currentUser as any)._id : null;

    // Prevent deleting yourself
    if (userId === currentUserId) {
      alert('You cannot delete your own account.');
      return;
    }

    // Confirmation dialog
    const confirmed = confirm(`Are you sure you want to delete user "${user.fullName}" (${user.email})? This action cannot be undone.`);
    
    if (!confirmed) {
      return;
    }

    this.saving = true;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.saving = false;
      },
      error: (err: any) => {
        console.error('Error deleting user:', err);
        alert(err.error?.message || 'Failed to delete user');
        this.saving = false;
      }
    });
  }

  isCurrentUser(user: User): boolean {
    const userId = this.getUserId(user);
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;
    const currentUserId = (currentUser as any).id || (currentUser as any)._id;
    return userId === currentUserId;
  }
}
