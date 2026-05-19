import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { useUiStore } from '@/store/ui-store'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const items = [
  { label: 'Дашборд', path: '/trainer' },
  { label: 'Клиенты', path: '/trainer/clients' },
  { label: 'Конструктор', path: '/trainer/workouts/builder' },
  { label: 'Программы', path: '/trainer/programs' },
  { label: 'Упражнения', path: '/trainer/exercises' },
  { label: 'Календарь', path: '/trainer/calendar' },
  { label: 'Аналитика', path: '/trainer/analytics' },
  { label: 'Финансы', path: '/trainer/finance' },
  { label: 'Чаты', path: '/trainer/messages' },
  { label: 'AI-коуч', path: '/trainer/ai-coach' },
  { label: 'Файлы', path: '/trainer/files' },
  { label: 'Настройки', path: '/trainer/settings' },
]

export function CommandPalette() {
  const open = useUiStore((s) => s.commandOpen)
  const setOpen = useUiStore((s) => s.setCommandOpen)
  const navigate = useNavigate()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-[var(--text-muted)]">
          <Command.Input placeholder="Поиск разделов…" className="w-full border-b border-[var(--border)] bg-transparent px-4 py-3 outline-none" />
          <Command.List className="max-h-72 overflow-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-[var(--text-muted)]">Ничего не найдено</Command.Empty>
            <Command.Group heading="Навигация">
              {items.map((item) => (
                <Command.Item
                  key={item.path}
                  onSelect={() => { setOpen(false); navigate(item.path) }}
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm aria-selected:bg-[var(--accent)]/10 aria-selected:text-[var(--accent)]"
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
