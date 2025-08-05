'use client'

import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'

interface Props {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PaginationComponent: React.FC<Props> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const renderPageNumbers = () => {
    const pages = []
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault()
              if (i !== currentPage) onPageChange(i)
            }}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize" className="text-sm text-muted-foreground whitespace-nowrap">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-input bg-background px-2 py-1 text-sm rounded-md"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 0) onPageChange(currentPage - 1)
              }}
              aria-disabled={currentPage === 0}
              className={currentPage === 0 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {renderPageNumbers()}

          {totalPages > 5 && <PaginationEllipsis />}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages - 1) onPageChange(currentPage + 1)
              }}
              aria-disabled={currentPage === totalPages - 1}
              className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default PaginationComponent
