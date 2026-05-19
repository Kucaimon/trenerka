import { useState } from 'react'
import { toast } from 'sonner'
import { useNews, useSaveNews, useDeleteNews } from '@/features/api/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { NewsItem } from '@/types'

export function NewsAdminPage() {
  const { data: news = [], isLoading } = useNews()
  const saveNews = useSaveNews()
  const deleteNews = useDeleteNews()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<NewsItem | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const openForm = (item?: NewsItem) => {
    setEditing(item ?? null)
    setTitle(item?.title ?? '')
    setContent(item?.content ?? '')
    setOpen(true)
  }

  const onSave = async () => {
    if (!title.trim()) return
    try {
      await saveNews.mutateAsync({
        id: editing?.id ?? '',
        title,
        content,
        publishedAt: editing?.publishedAt ?? new Date().toISOString().slice(0, 10),
      })
      toast.success('Сохранено')
      setOpen(false)
    } catch {
      toast.error('Ошибка')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Новости</h1>
        <Button onClick={() => openForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Создать
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? <p className="text-sm text-slate-500">Загрузка…</p> : null}
        {news.map((n) => (
          <Card key={n.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{n.title}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{formatDate(n.publishedAt)}</span>
                <Button variant="ghost" size="icon" onClick={() => openForm(n)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400"
                  onClick={() => deleteNews.mutate(n.id, { onSuccess: () => toast.success('Удалено') })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">{n.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать' : 'Новая новость'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Заголовок</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Текст</Label>
              <Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <Button className="w-full" onClick={onSave} disabled={saveNews.isPending}>
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
