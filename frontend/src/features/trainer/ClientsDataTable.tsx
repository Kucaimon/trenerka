import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
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

export interface ClientsDataTableProps {
  clients: Client[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function ClientsDataTable({ clients, activeId, onSelect }: ClientsDataTableProps) {
  const { t } = useTranslation(['trainer', 'common'])

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => t('clients.table.name'),
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
        header: () => t('clients.table.status'),
        cell: ({ getValue }) => (
          <Badge variant={STATUS_VARIANTS[getValue()]} className="px-1.5 py-0 text-[10px]">
            {t(`common:status.${getValue()}`)}
          </Badge>
        ),
      }),
      columnHelper.accessor('goal', {
        header: () => t('clients.table.goal'),
        cell: ({ row }) => (
          <span className="text-[var(--text-secondary)]">{row.original.goal ?? t('clients.fallback.program')}</span>
        ),
      }),
      columnHelper.accessor('packageBalance', {
        header: () => t('clients.table.sessions'),
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
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
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
              className={cn('cursor-pointer', row.original.id === activeId && 'saas-table__row--active bg-[var(--accent-dim)]')}
              onClick={() => onSelect(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
