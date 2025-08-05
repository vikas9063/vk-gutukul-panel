"use client";

import { Permission, Role } from "@/interface/types";
import apiClient from "@/lib/AxiosUtils";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PermissionWithState = Permission & {
  isCheckedBefore: boolean;
  isCheckedNow: boolean;
};

const RolePermission = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionsState, setPermissionsState] = useState<PermissionWithState[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const getAllPermissions = async () => {
    const res = await apiClient.get(`/permissions/view`);
    return res.data.result as Permission[];
  };

  const getAllRoles = async () => {
    const res = await apiClient.get(`/permissions/view-all-roles`);
    return res.data.result as Role[];
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [permissions, rolesData] = await Promise.all([
        getAllPermissions(),
        getAllRoles(),
      ]);
      setRoles(rolesData);
      if (rolesData.length > 0) {
        const defaultRole = rolesData[0];
        setSelectedRoleId(defaultRole.roleId);

        const permissionWithState = permissions.map((p) => ({
          ...p,
          isCheckedBefore: defaultRole.permissions.some((rp) => rp.id === p.id),
          isCheckedNow: defaultRole.permissions.some((rp) => rp.id === p.id),
        }));
        setPermissionsState(permissionWithState);
      }
    } catch (err) {
      toast.error("Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (roleId: number) => {
    setSelectedRoleId(roleId);
    const selectedRole = roles.find((r) => r.roleId === roleId);
    if (!selectedRole) return;

    const updatedPermissions = permissionsState.map((p) => {
      const isAssigned = selectedRole.permissions.some((rp) => rp.id === p.id);
      return {
        ...p,
        isCheckedBefore: isAssigned,
        isCheckedNow: isAssigned,
      };
    });
    setPermissionsState(updatedPermissions);
  };

  const handleCheckboxChange = (permissionId: number, checked: boolean) => {
    setPermissionsState((prev) =>
      prev.map((perm) =>
        perm.id === permissionId ? { ...perm, isCheckedNow: checked } : perm
      )
    );
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;

    const changedPermissions = permissionsState.filter(
      (p) => p.isCheckedBefore !== p.isCheckedNow
    );

    if (changedPermissions.length === 0) {
      toast.warning("No changes to save.");
      return;
    }

    const updatedPermissionIds = permissionsState
      .filter((p) => p.isCheckedNow)
      .map((p) => p.id);

    setIsSaving(true);
    try {
      await apiClient.put(`/permissions/update-role-permissions/${selectedRoleId}`, {
        permissionIds: updatedPermissionIds,
      });

      setPermissionsState((prev) =>
        prev.map((p) => ({ ...p, isCheckedBefore: p.isCheckedNow }))
      );

      toast.success("Permissions updated successfully.");
    } catch (err) {
      toast.error("Failed to update permissions");
    } finally {
      setIsSaving(false);
    }
  };

  // Group permissions by prefix before ":"
  const groupedPermissions = permissionsState.reduce((groups, perm) => {
    const [prefix] = perm.permissionName.split(":");
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(perm);
    return groups;
  }, {} as Record<string, PermissionWithState[]>);

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">Manage Role Permissions</h2>

      {isLoading ? (
        <>
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-10 w-full mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 border p-2 rounded-md"
              >
                <Skeleton className="h-4 w-4" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Role Select Dropdown */}
          <div className="mb-6">
            <Label>Select Role</Label>
            <Select
              value={selectedRoleId?.toString()}
              onValueChange={(val) => handleRoleChange(Number(val))}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.roleId} value={role.roleId.toString()}>
                    {role.roleTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grouped Permissions */}
          <div>
            <Label className="text-base">Permissions</Label>
            <div className="space-y-6 mt-3">
              {Object.entries(groupedPermissions).map(([groupName, perms]) => (
                <div key={groupName}>
                  <h4 className="text-md font-semibold mb-2 capitalize">
                    {groupName} Permissions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {perms.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-2 border p-2 rounded-md"
                      >
                        <Checkbox
                          checked={permission.isCheckedNow}
                          onCheckedChange={(val) =>
                            handleCheckboxChange(permission.id, !!val)
                          }
                        />
                        <div className="text-sm">
                          <div className="font-medium">{permission.permissionName}</div>
                          <div className="text-muted-foreground">
                            {permission.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RolePermission;
