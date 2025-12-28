import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Navbar } from '../../shared/navbar/navbar';
import { RoleService } from '../../../services/role.service';
import { AuthService } from '../../../services/auth.service';
import { SidebarService } from '../../../services/sidebar.service';
import { Role, PermissionMatrix } from '../../../models/role';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './role-management.html',
  styleUrl: './role-management.css',
})
export class RoleManagement implements OnInit {
  roles: Role[] = [];
  accessMatrix: PermissionMatrix[] = [];
  newRoleName = '';
  showNewRoleForm = false;
  newRolePermissions = {
    create: false,
    edit: false,
    delete: false,
    publish: false,
    view: true
  };
  editingRoleId: string | null = null;
  editingPermissions: any = null;
  loading = false;
  saving = false;
  sidebarOpen = true;

  constructor(
    private roleService: RoleService,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });

    this.loadRoles();
    this.loadAccessMatrix();
  }

  loadRoles() {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        this.loading = false;
      }
    });
  }

  loadAccessMatrix() {
    this.roleService.getAccessMatrix().subscribe({
      next: (matrix) => {
        this.accessMatrix = matrix;
      },
      error: (err) => {
        console.error('Error loading access matrix:', err);
      }
    });
  }

  openNewRoleForm() {
    this.showNewRoleForm = true;
    this.newRoleName = '';
    this.newRolePermissions = {
      create: false,
      edit: false,
      delete: false,
      publish: false,
      view: true
    };
  }

  cancelNewRole() {
    this.showNewRoleForm = false;
    this.newRoleName = '';
  }

  addRole() {
    if (!this.newRoleName.trim()) {
      alert('Please enter a role name');
      return;
    }

    this.saving = true;
    this.roleService.createRole({
      name: this.newRoleName.trim(),
      permissions: this.newRolePermissions
    }).subscribe({
      next: () => {
        this.loadRoles();
        this.loadAccessMatrix();
        this.showNewRoleForm = false;
        this.newRoleName = '';
        this.saving = false;
      },
      error: (err) => {
        console.error('Error creating role:', err);
        alert(err.error?.message || 'Failed to create role');
        this.saving = false;
      }
    });
  }

  startEditRole(role: Role) {
    this.editingRoleId = role._id;
    this.editingPermissions = { ...role.permissions };
  }

  cancelEditRole() {
    this.editingRoleId = null;
    this.editingPermissions = null;
  }

  saveRoleChanges(role: Role) {
    if (!this.editingPermissions) return;

    this.saving = true;
    this.roleService.updateRole(role._id, {
      permissions: this.editingPermissions
    }).subscribe({
      next: () => {
        this.loadRoles();
        this.loadAccessMatrix();
        this.editingRoleId = null;
        this.editingPermissions = null;
        this.saving = false;
      },
      error: (err) => {
        console.error('Error updating role:', err);
        alert('Failed to update role');
        this.saving = false;
      }
    });
  }

  deleteRole(role: Role) {
    if (!role.isCustom) {
      alert('Cannot delete default roles');
      return;
    }

    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      this.roleService.deleteRole(role._id).subscribe({
        next: () => {
          this.loadRoles();
          this.loadAccessMatrix();
        },
        error: (err) => {
          console.error('Error deleting role:', err);
          alert('Failed to delete role');
        }
      });
    }
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
