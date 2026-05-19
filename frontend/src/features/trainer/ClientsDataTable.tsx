import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Client, ClientStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_VARIANTS: Record<ClientStatus, 'success' | 'warning' | 'secondary'> = {
  active: 'success',
  pause: 'warning',
  archive: 'secondary',
}

function avatarClass() {
  return 'border border-[var(--border-strong)] bg-[var(--accent-dim)] text-[var(--accent)]'
}

const columnHelper = createColumnHelper<Client>()

function SortableHeader({
  label,
  sorted,
  onClick,
}: {
  label: string
  sorted: false | 'asc' | 'desc'
  onClick: () => void
}) {
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)]"
    >
      {label}
      <Icon className="h-3 w-3 opacity-60" />
    </button>
  )
}

export interface ClientsDataTableProps {
  clients: Client[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function ClientsDataTable({ clients, activeId, onSelect }: ClientsDataTableProps) {
  const { t } = useTranslation(['trainer', 'common'])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <SortableHeader
            label={t('clients.table.name')}
            sorted={column.getIsSorted() || false}
            onClick={() => column.toggleSorting()}
          />
        ),
        size: 200,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', avatarClass())}>
              {row.original.name.slice(0, 1)}
            </div>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: ({ column }) => (
          <SortableHeader
            label={t('clients.table.status')}
            sorted={column.getIsSorted() || false}
            onClick={() => column.toggleSorting()}
          />
        ),
        size: 110,
        cell: ({ getValue }) => (
          <Badge variant={STATUS_VARIANTS[getValue()]} className="px-1.5 py-0 text-[10px]">
            {t(`common:status.${getValue()}`)}
          </Badge>
        ),
      }),
      columnHelper.accessor('goal', {
        header: () => t('clients.table.goal'),
        size: 160,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-[var(--text-secondary)]">{row.original.goal ?? t('clients.fallback.program')}</span>
        ),
      }),
      columnHelper.accessor('packageBalance', {
        header: () => t('clients.table.sessions'),
        size: 96,
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="tabular-nums text-[var(--text-secondary)]">
            {getValue()} {t('common:units.sessionsShort')}
          </span>
        ),
      }),
    ],
    [t],
  )

  const table = useReactTable({
    data: clients,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} style={{ width: header.getSize() }}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className="py-8 text-center text-[var(--text-muted)]">
              {t('clients.empty')}
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(
                'cursor-pointer hover:bg-[var(--surface2)]',
                row.original.id === activeId && 'bg-[var(--surface2)] shadow-[inset_2px_0_0_var(--accent)]',
              )}
              onClick={() => onSelect(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
