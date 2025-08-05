'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface SearchFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortKey: string
  sortOrder: 'asc' | 'desc'
  onSortKeyChange: (key: string) => void
  onSortOrderToggle: () => void
  filterKeys: string[]
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  sortKey,
  sortOrder,
  onSortKeyChange,
  onSortOrderToggle,
  filterKeys,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      {/* Search Section */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Label htmlFor="search" className="text-sm text-muted-foreground whitespace-nowrap">
          Search:
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      {/* Filter + Sort Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={sortKey} onValueChange={onSortKeyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {filterKeys.map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onSortOrderToggle} className="cursor-pointer whitespace-nowrap">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          {sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </Button>
      </div>
    </div>
  )
}

export default SearchFilter
