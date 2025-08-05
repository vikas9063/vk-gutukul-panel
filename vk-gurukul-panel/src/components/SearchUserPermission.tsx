"use client";

import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/AxiosUtils";
import { User } from "@/interface/types";
import { useRouter } from "next/navigation";
import axios from "axios";

const UserPermission = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const cancelTokenRef = useRef<ReturnType<typeof axios.CancelToken.source> | null>(null);

  const searchUser = async (key: string) => {
    if (!key.trim() || key.length < 2) {
      setUsers([]);
      return;
    }

    try {
      setSearching(true);

      // Cancel previous request if still running
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Cancelled due to new search");
      }
      cancelTokenRef.current = axios.CancelToken.source();

      const res = await apiClient.get(`/user/all-users?keyword=${key}`, {
        cancelToken: cancelTokenRef.current.token,
      });

      const foundUsers: User[] = res.data.result || [];
      setUsers(foundUsers);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Search error", err);
      }
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      searchUser(searchTerm);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleUserSelect = (user: User) => {
    router.push(`/secured/admin/roles/user-permission/${user.userId}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Search & Select User
      </h2>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by name, email, or mobile number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm"
        />
      </div>

      {searching && <p className="text-sm text-gray-500">Searching...</p>}

      {!searching && users.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-medium mb-3 text-gray-700">Select a user:</h3>
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li
                key={user.userId}
                className="py-3 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                onClick={() => handleUserSelect(user)}
              >
                <p className="text-sm font-semibold text-gray-800">
                  {user.userEmail}
                </p>
                <p className="text-xs text-gray-500">{user.mobileNo}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!searching && searchTerm && users.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No users found.</p>
      )}
    </div>
  );
};

export default UserPermission;
