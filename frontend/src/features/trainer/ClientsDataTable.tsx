import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
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
import { enrichClient, formatRelativeActivity, formatUpcomingSession } from '@/lib/client-crm'
import type { Client, ClientStatus, PaymentState } from '@/types'
import { intlLocale } from '@/lib/i18n-format'
import { cn } from '@/lib/utils'

const STATUS_VARIANTS: Record<ClientStatus, 'success' | 'warning' | 'secondary'> = {
  active: 'success',
  pause: 'warning',
  archive: 'secondary',
}

const PAYMENT_VARIANTS: Record<PaymentState, 'success' | 'warning' | 'destructive'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'destructive',
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
  paymentFilter?: PaymentState | 'all'
}

export function ClientsDataTable({ clients, activeId, onSelect, paymentFilter = 'all' }: ClientsDataTableProps) {
  const { t, i18n } = useTranslation(['trainer', 'common'])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const rows = useMemo(() => clients.map(enrichClient), [clients])

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
        cell: ({ row }) => {
          const c = enrichClient(row.original)
          const engaged = c.status === 'active'
          return (
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold', avatarClass())}>
                  {c.name.slice(0, 1)}
                </div>
                <span
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[var(--surface)]',
                    engaged ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)]',
                  )}
                  title={t(`common:status.${c.status}`)}
                />
              </div>
              <div className="min-w-0">
                <span className="font-medium">{c.name}</span>
                {c.upcomingSessionAt ? (
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {t('clients.table.nextSession', {
                      date: formatUpcomingSession(c.upcomingSessionAt, intlLocale(i18n.language)),
                    })}
                  </p>
                ) : null}
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor((row) => enrichClient(row).paymentState ?? 'pending', {
        id: 'paymentState',
        header: ({ column }) => (
          <SortableHeader
            label={t('clients.table.payment')}
            sorted={column.getIsSorted() || false}
            onClick={() => column.toggleSorting()}
          />
        ),
        size: 96,
        filterFn: (row, _id, value) => value === 'all' || enrichClient(row.original).paymentState === value,
        cell: ({ row }) => {
          const state = enrichClient(row.original).paymentState ?? 'pending'
          return (
            <Badge variant={PAYMENT_VARIANTS[state]} className="px-1.5 py-0 text-[10px]">
              {t(`clients.paymentState.${state}`)}
            </Badge>
          )
        },
      }),
      columnHelper.accessor((row) => enrichClient(row).lastActivityMinutesAgo ?? 0, {
        id: 'lastActivity',
        header: ({ column }) => (
          <SortableHeader
            label={t('clients.table.activity')}
            sorted={column.getIsSorted() || false}
            onClick={() => column.toggleSorting()}
          />
        ),
        size: 100,
        cell: ({ row }) => {
          const mins = enrichClient(row.original).lastActivityMinutesAgo ?? 0
          return (
            <span className="text-[12px] text-[var(--text-secondary)]">
              {formatRelativeActivity(mins, t)}
            </span>
          )
        },
      }),
      columnHelper.accessor((row) => enrichClient(row).workoutCompletionPct ?? 0, {
        id: 'completion',
        header: ({ column }) => (
          <SortableHeader
            label={t('clients.table.completion')}
            sorted={column.getIsSorted() || false}
            onClick={() => column.toggleSorting()}
          />
        ),
        size: 88,
        cell: ({ row }) => {
          const c = enrichClient(row.original)
          return (
            <span className="tabular-nums text-[12px] text-[var(--text-secondary)]">
              {c.workoutCompletionPct != null
                ? t('clients.table.completionPct', { pct: c.workoutCompletionPct })
                : t('clients.table.sessionsWeek', { count: c.sessionsThisWeek ?? 0 })}
            </span>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: ({ column }) => (
          <SortableHeader
            label={t('clients.table.status')}
            sorted={column.getIsSorted() || false}
            onClick={() => column.toggleSorting()}
          />
        ),
        size: 88,
        cell: ({ getValue }) => (
          <Badge variant={STATUS_VARIANTS[getValue()]} className="px-1.5 py-0 text-[10px]">
            {t(`common:status.${getValue()}`)}
          </Badge>
        ),
      }),
    ],
    [t, i18n.language],
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      columnFilters: paymentFilter === 'all' ? columnFilters : [{ id: 'paymentState', value: paymentFilter }],
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
