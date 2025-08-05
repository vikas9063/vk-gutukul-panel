// Permission interface
export interface Permission {
    id: number;
    permissionName: string;
    description: string;
}

export interface Permission {
  id: number;
  permissionName: string;
  description: string;
}

export interface Role {
  roleId: number;
  roleTitle: string;
  roleDesc: string;
  permissions: Permission[];
}

export interface UserRoleMap {
  userRoleMapId: number;
  roles: Role;
}

export interface Authority {
  authority: string;
}

export interface User {
  userId: string;
  userEmail: string;
  mobileNo: string;
  password: string;
  userRegDate: string;
  userRoles: UserRoleMap[];
  userPermissions: Permission[];
  enabled: boolean;
  deleted: boolean;
  username: string;
  authorities: Authority[];
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}
