import React from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table'

type Column<T> = {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
}

interface TableComponentProps<T> {
  columns: Column<T>[]
  data: T[]
}

const TableComponent = <T,>({ columns, data }: TableComponentProps<T>) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, idx) => (
            <TableHead key={idx}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col, colIndex) => (
              <TableCell key={colIndex}>
                {typeof col.accessor === 'function'
                  ? col.accessor(row)
                  : (row as any)[col.accessor]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableComponent
