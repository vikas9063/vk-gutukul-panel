'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import {
  Power,
  SquareChartGantt,
} from 'lucide-react'

import PageHeading from '@/components/PageHeading'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import Loader from '@/app/loading'
import TableComponent from '@/components/TableComponent'
import PaginationComponent from '@/components/PaginationComponent'
import SearchFilter from '@/components/SearchFilter'
import apiClient from '@/lib/AxiosUtils'

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)

  const [sortKey, setSortKey] = useState('userRegDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const router = useRouter()

  const fetchUsers = async (currentPage: number, size = pageSize, keyword = debouncedSearch) => {
    setLoading(true)
    try {
      const res = await apiClient.get(`/user/all-users`, {
        params: {
          page: currentPage,
          size,
          sortBy: sortKey,
          sortDir: sortOrder,
          type: 'NOT_DELETED',
          keyword,
        },
      })
      setUsers(res.data.result || [])
      setTotalPages(res.data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, sortKey, sortOrder])

  useEffect(() => {
    fetchUsers(page, pageSize, debouncedSearch)
  }, [page, pageSize, debouncedSearch, sortKey, sortOrder])

  const handleToggleUserStatus = async (userId: string, isEnabled: boolean) => {
    if (isEnabled) {
      setSelectedUserId(userId)
      setConfirmDialogOpen(true)
    } else {
      await apiClient.put(`/user/enable/${userId}`)
      fetchUsers(page)
    }
  }

  const confirmDisableUser = async () => {
    if (!selectedUserId) return
    try {
      await apiClient.put(`/user/disable/${selectedUserId}`)
      fetchUsers(page)
    } catch (error) {
      console.error('Error disabling user:', error)
    } finally {
      setConfirmDialogOpen(false)
      setSelectedUserId(null)
    }
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(0)
  }

  const userColumns = [
    { header: 'User ID', accessor: 'userId' },
    { header: 'Email', accessor: 'userEmail' },
    { header: 'Mobile', accessor: 'mobileNo' },
    {
      header: 'Roles',
      accessor: (user: any) =>
        user.userRoles?.map((ur: any) => ur.roles?.roleTitle).join(', ') || 'N/A',
    },
    {
      header: 'Actions',
      accessor: (user: any) => (
        <div className="flex gap-2">
          <Button
            variant={user.enabled ? 'outline' : 'secondary'}
            size="sm"
            className="text-sm flex items-center gap-1"
            onClick={() => handleToggleUserStatus(user.userId, user.enabled)}
          >
            <Power className={`h-4 w-4 ${user.enabled ? 'text-green-600' : 'text-gray-500'}`} />
            {user.enabled ? 'Disable' : 'Enable'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-sm flex items-center gap-1"
            disabled={user.deleted}
            onClick={() => router.push(`/secured/admin/roles/user-permission/${user.userId}`)}
          >
            <SquareChartGantt className="h-4 w-4" />
            Assign Permission
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-1 md:p-6 space-y-4">
      <PageHeading title="All Users" />

      <SearchFilter
        searchTerm={search}
        onSearchChange={setSearch}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortKeyChange={setSortKey}
        onSortOrderToggle={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        filterKeys={['userId', 'userEmail', 'mobileNo', 'userRegDate']}
      />

      <Card className="p-4">
        {loading ? (
          <div className="text-center py-6 text-muted-foreground">
            <Loader />
          </div>
        ) : (
          <TableComponent columns={userColumns} data={users} />
        )}
      </Card>

      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disable this user? They will no longer be able to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisableUser}>Yes, Disable</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UsersPage
