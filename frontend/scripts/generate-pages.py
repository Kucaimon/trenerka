#!/usr/bin/env python3
"""Generate remaining Trenerka feature pages."""
import os

ROOT = os.path.join(os.path.dirname(__file__), '..', 'src', 'features')

PAGES = {
'trainer/WorkoutBuilderPage.tsx': '''
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus } from 'lucide-react'
import { getExercises } from '@/features/api/exercises-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Exercise } from '@/types'

function SortableExercise({ ex, onRemove }: { ex: Exercise; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ex.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-lg bg-[#111827] p-3">
      <button type="button" {...attributes} {...listeners} className="text-slate-500"><GripVertical className="h-4 w-4" /></button>
      <motionDiv className="flex-1">
        <p className="font-medium">{ex.name}</p>
        <p className="text-xs text-slate-500">{ex.muscleGroup} · {ex.equipment}</p>
        <div className="mt-2 flex gap-2">
          <Input className="h-8 w-16" defaultValue="4" placeholder="подх" />
          <Input className="h-8 w-16" defaultValue="8" placeholder="повт" />
          <Input className="h-8 w-16" defaultValue="90" placeholder="отдых" />
        </div>
      </motionDiv>
      <Button variant="ghost" size="sm" onClick={onRemove}>×</Button>
    </motionDiv>
  )
}

export function WorkoutBuilderPage() {
  const { data: library = [] } = useQuery({ queryKey: ['exercises'], queryFn: getExercises })
  const [selected, setSelected] = useState<Exercise[]>([])
  const [week, setWeek] = useState('mon')

  const add = (ex: Exercise) => {
    if (!selected.find((s) => s.id === ex.id)) setSelected([...selected, ex])
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      const oldIndex = selected.findIndex((s) => s.id === active.id)
      const newIndex = selected.findIndex((s) => s.id === over.id)
      setSelected(arrayMove(selected, oldIndex, newIndex))
    }
  }

  return (
    <motionDiv className="space-y-6">
      <h1 className="text-2xl font-bold">Конструктор тренировок</h1>
      <Tabs value={week} onValueChange={setWeek}>
        <TabsList>
          {['mon','tue','wed','thu','fri','sat','sun'].map((d, i) => (
            <TabsTrigger key={d} value={d}>{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={week} className="mt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Программа</CardTitle></CardHeader>
              <CardContent>
                <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={selected.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                    <motionDiv className="space-y-2">
                      {selected.map((ex) => (
                        <SortableExercise key={ex.id} ex={ex} onRemove={() => setSelected(selected.filter((s) => s.id !== ex.id))} />
                      ))}
                    </motionDiv>
                  </SortableContext>
                </DndContext>
                {!selected.length && <p className="text-slate-500">Добавьте упражнения из библиотеки</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Библиотека ({library.length})</CardTitle></CardHeader>
              <CardContent className="max-h-96 space-y-2 overflow-auto">
                {library.map((ex) => (
                  <button key={ex.id} type="button" onClick={() => add(ex)} className="flex w-full items-center justify-between rounded-lg bg-[#111827] p-2 text-left text-sm hover:bg-white/10">
                    <span>{ex.name}</span>
                    <Plus className="h-4 w-4 text-[#d9f500]" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </motionDiv>
        </TabsContent>
      </Tabs>
    </motionDiv>
  )
}
''',
}

for rel, content in PAGES.items():
    content = content.replace('motionDiv', 'div')
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + '\n')
    print('wrote', rel)

PY