import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from './primitives/EmptyState'

export type DataTableColumn<T> = {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
}

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
  onRowClick?: (row: T) => void
  activeRowKey?: string | null
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyTitle,
  emptyDescription,
  onRowClick,
  activeRowKey,
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? 'No data'}
        description={emptyDescription}
        className="border-0 bg-transparent py-8"
      />
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)]', className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={col.id} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const key = getRowKey(row)
            return (
              <TableRow
                key={key}
                className={cn(
                  onRowClick && 'cursor-pointer',
                  activeRowKey === key && 'bg-[var(--surface3)]',
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.id} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
