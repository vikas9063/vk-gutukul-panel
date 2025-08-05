"use client";

import { Permission, User } from "@/interface/types";
import apiClient from "@/lib/AxiosUtils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import PageHeading from "@/components/PageHeading";

export default function UserPermissionPage() {
  const { userId } = useParams() as { userId: string };
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingRoles, setSavingRoles] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);

  const [permissionsState, setPermissionsState] = useState<
    (Permission & { isCheckedNow: boolean; fromRole: boolean })[]
  >([]);
  const [availableRoles, setAvailableRoles] = useState<
    { roleId: number; roleTitle: string }[]
  >([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const getUser = async () => {
    try {
      const res = await apiClient.get(`/user/id/${userId}`);
      const user: User = res.data.result;
      setSelectedUser(user);

      const rolePermissions = user.userRoles.flatMap((ur) => ur.roles.permissions);
      const userPermissions = user.userPermissions;

      const allPermissionMap = new Map<number, Permission & { fromRole: boolean }>();

      rolePermissions.forEach((p) => allPermissionMap.set(p.id, { ...p, fromRole: true }));
      userPermissions.forEach((p) =>
        allPermissionMap.set(p.id, { ...p, fromRole: false })
      );

      setPermissionsState((prev) =>
        prev.map((perm) => {
          const fromMap = allPermissionMap.get(perm.id);
          return {
            ...perm,
            isCheckedNow: !!fromMap,
            fromRole: fromMap?.fromRole ?? false,
          };
        })
      );

      const roleIds = user.userRoles.map((ur) => ur.roles.roleId);
      setSelectedRoleIds(roleIds);
    } catch (err) {
      toast.error("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const getAllPermissions = async () => {
    try {
      const res = await apiClient.get(`/permissions/view`);
      const allPermissions: Permission[] = res.data.result || [];
      setPermissionsState(
        allPermissions.map((perm) => ({
          ...perm,
          isCheckedNow: false,
          fromRole: false,
        }))
      );
    } catch (err) {
      toast.error("Failed to load permissions");
    }
  };

  const fetchAllRoles = async () => {
    try {
      const res = await apiClient.get("/permissions/view-all-roles");
      setAvailableRoles(res.data.result || []);
    } catch (err) {
      toast.error("Failed to load roles");
    }
  };

  useEffect(() => {
    if (userId) {
      getAllPermissions().then(() => {
        fetchAllRoles().then(() => {
          getUser();
        });
      });
    }
  }, [userId]);

  const updateUserRoles = async () => {
    if (!selectedUser) return;
    try {
      setSavingRoles(true);
      await apiClient.put(`/permissions/user/role/${selectedUser.userId}`, {
        roleIds: selectedRoleIds,
      });
      toast.success("User roles updated successfully");
    } catch (err) {
      toast.error("Failed to update user roles");
    } finally {
      setSavingRoles(false);
    }
  };

  const updateUserPermissions = async () => {
    if (!selectedUser) return;
    const directPermissionIds = permissionsState
      .filter((p) => p.isCheckedNow && !p.fromRole)
      .map((p) => p.id);

    try {
      setSavingPermissions(true);
      await apiClient.put(`/permissions/user/${selectedUser.userId}`, {
        permissionIds: directPermissionIds,
      });
      toast.success("User permissions updated successfully");
    } catch (err) {
      toast.error("Failed to update user permissions");
    } finally {
      setSavingPermissions(false);
    }
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setPermissionsState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isCheckedNow: checked } : p))
    );
  };

  if (loading || !selectedUser) {
    return (
      <div className="w-full py-20 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  // Group permissions by prefix before colon
  const groupedPermissions = permissionsState.reduce(
    (acc, perm) => {
      const [group] = perm.permissionName.split(":");
      if (!acc[group]) acc[group] = [];
      acc[group].push(perm);
      return acc;
    },
    {} as Record<string, (Permission & { isCheckedNow: boolean; fromRole: boolean })[]>
  );

  return (
    <div className="w-full">
      <PageHeading title="User Privileges" />
      <div className="sm:p-4 md:p-10">
        <h2 className="text-xl font-semibold mb-4">
          Update Permissions for{" "}
          <span className="text-primary">{selectedUser.userEmail}</span>
        </h2>

        {/* Role Section */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Assign Roles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableRoles.map((role) => (
              <div
                key={role.roleId}
                className="flex items-center space-x-2 border rounded p-2"
              >
                <Checkbox
                  checked={selectedRoleIds.includes(role.roleId)}
                  onCheckedChange={(val) => {
                    if (val) {
                      setSelectedRoleIds((prev) => [...prev, role.roleId]);
                    } else {
                      setSelectedRoleIds((prev) =>
                        prev.filter((id) => id !== role.roleId)
                      );
                    }
                  }}
                />
                <span className="text-sm">{role.roleTitle}</span>
              </div>
            ))}
          </div>
          <Button
            className="mt-4"
            onClick={updateUserRoles}
            disabled={savingRoles}
            size="sm"
          >
            {savingRoles ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving...
              </>
            ) : (
              "Update Roles"
            )}
          </Button>
        </div>
        <hr />
        {/* Permissions Section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Assign Direct Permissions</h3>

          {Object.entries(groupedPermissions).map(([group, perms]) => (
            <div key={group} className="mb-6">
              <h4 className="text-md font-semibold mb-2 capitalize">
                {group} Permissions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {perms.map((perm) => (
                  <div
                    key={perm.id}
                    className={`flex items-start space-x-2 border p-3 rounded-md ${perm.fromRole ? "bg-gray-50" : ""
                      }`}
                  >
                    <Checkbox
                      checked={perm.isCheckedNow}
                      disabled={perm.fromRole}
                      onCheckedChange={(val) =>
                        handleCheckboxChange(perm.id, !!val)
                      }
                    />
                    <div className="text-sm">
                      <p className="font-medium">{perm.permissionName}</p>
                      <p className="text-muted-foreground text-xs">
                        {perm.description}
                      </p>
                      {perm.fromRole && (
                        <p className="text-yellow-600 text-xs mt-1">
                          * From role, cannot be removed directly
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button
            className="mt-4"
            onClick={updateUserPermissions}
            disabled={savingPermissions}
            size="sm"
          >
            {savingPermissions ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving...
              </>
            ) : (
              "Update Permissions"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
