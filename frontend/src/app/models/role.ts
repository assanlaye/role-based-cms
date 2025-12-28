export interface Role {
  _id: string;
  name: string;
  permissions: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish: boolean;
    view: boolean;
  };
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionMatrix {
  role: string;
  permissions: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish: boolean;
    view: boolean;
  };
}

export interface CreateRoleRequest {
  name: string;
  permissions: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish: boolean;
    view: boolean;
  };
}

export interface UpdateRoleRequest {
  name?: string;
  permissions?: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish: boolean;
    view: boolean;
  };
}
