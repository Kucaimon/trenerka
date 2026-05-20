import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Command } from 'cmdk'
import { useUiStore } from '@/store/ui-store'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function CommandPalette() {
  const { t } = useTranslation('common')
  const open = useUiStore((s) => s.commandOpen)
  const setOpen = useUiStore((s) => s.setCommandOpen)
  const navigate = useNavigate()

  const items = [
    { label: t('commandPalette.items.dashboard'), path: '/trainer' },
    { label: t('commandPalette.items.clients'), path: '/trainer/clients' },
    { label: t('commandPalette.items.builder'), path: '/trainer/workouts/builder' },
    { label: t('commandPalette.items.programs'), path: '/trainer/programs' },
    { label: t('commandPalette.items.exercises'), path: '/trainer/exercises' },
    { label: t('commandPalette.items.calendar'), path: '/trainer/calendar' },
    { label: t('commandPalette.items.analytics'), path: '/trainer/analytics' },
    { label: t('commandPalette.items.finance'), path: '/trainer/finance' },
    { label: t('commandPalette.items.messages'), path: '/trainer/messages' },
    { label: t('commandPalette.items.files'), path: '/trainer/files' },
    { label: t('commandPalette.items.settings'), path: '/trainer/settings' },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-[var(--text-muted)]">
          <Command.Input
            placeholder={t('commandPalette.searchPlaceholder')}
            className="w-full border-b border-[var(--border)] bg-transparent px-4 py-3 outline-none"
          />
          <Command.List className="max-h-72 overflow-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-[var(--text-muted)]">
              {t('commandPalette.empty')}
            </Command.Empty>
            <Command.Group heading={t('commandPalette.group.navigation')}>
              {items.map((item) => (
                <Command.Item
                  key={item.path}
                  onSelect={() => {
                    setOpen(false)
                    navigate(item.path)
                  }}
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
