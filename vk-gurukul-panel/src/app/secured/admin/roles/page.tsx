import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import PageHeading from "@/components/PageHeading";
import RolePermission from "@/components/RolePermission";
import UserPermission from "@/components/SearchUserPermission";

export default function PermissionsForUser() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <PageHeading title="Roles and Permissions" />
      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="roles" className="w-full">
          <div className="m-3 w-full">
            <RolePermission />
          </div>
        </TabsContent>
        <TabsContent value="users" className="w-full">
          {/* Future content for users */}
          <div className="m-3 w-full">
            <UserPermission />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
