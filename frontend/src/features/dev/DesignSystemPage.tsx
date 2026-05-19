import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Inbox, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AppShell,
  AppSidebar,
  AppSidebarGroup,
  AppTopBar,
  AppContent,
  DashboardGrid,
  DashboardGridItem,
  SectionHeader,
  SaasPageHeader,
  DashboardContainer,
  AnalyticsWidget,
  EmptyState,
  LoadingState,
} from '@/components/saas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts'
import { CHART } from '@/lib/chart-theme'

const demoSchema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
})

const chartData = [
  { m: 'Jan', v: 12 },
  { m: 'Feb', v: 18 },
  { m: 'Mar', v: 15 },
  { m: 'Apr', v: 22 },
]

export function DesignSystemPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const form = useForm<z.infer<typeof demoSchema>>({
    resolver: zodResolver(demoSchema),
    defaultValues: { name: '' },
  })

  return (
    <AppShell variant="default">
      <AppSidebar
        header={
          <div className="border-b border-[var(--border)] px-5 py-4">
            <p className="ds-label">Trenerka DS</p>
            <p className="ds-h3 mt-1">/dev/design-system</p>
          </div>
        }
        footer={
          <Link to="/trainer" className="ds-caption ds-interactive block rounded px-2 py-1">
            ← Trainer app
          </Link>
        }
      >
        <AppSidebarGroup label="Sections">
          <a href="#typography" className="ds-app-sidebar-item snav-item">
            Typography
          </a>
          <a href="#primitives" className="ds-app-sidebar-item snav-item">
            Primitives
          </a>
          <a href="#layout" className="ds-app-sidebar-item snav-item">
            Layout
          </a>
        </AppSidebarGroup>
      </AppSidebar>

      <div className="ds-app-main trainer-main flex min-h-0 min-w-0 w-full flex-1 flex-col">
        <AppTopBar
          title={<span className="ds-h3">Design system</span>}
          search={
            <span className="ds-caption rounded border border-[var(--border)] px-3 py-1.5">
              Dev only · palette unchanged
            </span>
          }
        />
        <AppContent variant="default" className="ds-app-content--desktop max-w-5xl">
          <SaasPageHeader
            title="Foundational SaaS UI"
            description="Accent #b8f53d · black #080808 — tokens.css untouched"
            breadcrumbs={[{ label: 'Dev', href: '/dev/design-system' }, { label: 'Design system' }]}
            actions={<Button size="sm">Primary</Button>}
          />

          <section id="typography" className="ds-stack-24 mt-10">
            <SectionHeader title="Typography" description="ds-h1 … ds-label" />
            <div className="ds-panel ds-gap-16 flex flex-col p-6">
              <p className="ds-h1">Heading 1</p>
              <p className="ds-h2">Heading 2</p>
              <p className="ds-h3">Heading 3</p>
              <p className="ds-body">Body text for dashboards and forms.</p>
              <p className="ds-caption">Caption / secondary</p>
              <p className="ds-label">Label caps</p>
            </div>
          </section>

          <section id="primitives" className="ds-stack-24 mt-10">
            <SectionHeader title="Primitives" />
            <Tabs defaultValue="buttons">
              <TabsList>
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
              </TabsList>
              <TabsContent value="buttons" className="ds-stack-16 mt-4">
                <div className="flex flex-wrap gap-2">
                  {(['default', 'secondary', 'outline', 'ghost', 'destructive'] as const).map((v) => (
                    <Button key={v} variant={v}>
                      {v}
                    </Button>
                  ))}
                </div>
                <p className="ds-caption">Variants: default, secondary, outline, ghost, destructive, link</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="accent">Active</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Card</CardTitle>
                    <CardDescription>surface2 + border</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Dialog
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-[var(--border)] bg-[var(--surface)]">
                        <DialogHeader>
                          <DialogTitle className="ds-h3">Dialog</DialogTitle>
                        </DialogHeader>
                        <p className="ds-caption">tailwindcss-animate on overlay</p>
                      </DialogContent>
                    </Dialog>
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          Sheet (vaul)
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Drawer</SheetTitle>
                          <SheetDescription>Mobile-friendly panel</SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </TabsContent>
              <TabsContent value="table" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Anna K.</TableCell>
                      <TableCell>
                        <Badge>active</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="form" className="mt-4 max-w-sm">
                <Form {...form}>
                  <form className="ds-stack-16" onSubmit={form.handleSubmit(() => undefined)}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Demo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="sm">
                      Submit
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            <EmptyState
              icon={Inbox}
              title="No items"
              description="EmptyState primitive"
              action={
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              }
            />
            <LoadingState label="Loading…" />
          </section>

          <section id="layout" className="ds-stack-24 mt-10">
            <SectionHeader title="Dashboard grid" />
            <DashboardGrid>
              <DashboardGridItem span={8}>
                <AnalyticsWidget title="Revenue" description="AnalyticsWidget + recharts">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="m" stroke={CHART.axis} fontSize={11} />
                      <YAxis stroke={CHART.axis} fontSize={11} />
                      <Line type="monotone" dataKey="v" stroke={CHART.accent} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </AnalyticsWidget>
              </DashboardGridItem>
              <DashboardGridItem span={4}>
                <DashboardContainer title="Panel" description="span-4">
                  <p className="ds-body p-4">DashboardContainer</p>
                </DashboardContainer>
              </DashboardGridItem>
            </DashboardGrid>
          </section>
        </AppContent>
      </div>
    </AppShell>
  )
}
