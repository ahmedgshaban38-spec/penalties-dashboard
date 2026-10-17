import { cn } from '@/lib/utils'

export function Panel({
  title,
  description,
  children,
  className,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}) {
  return (
    <section className={cn('flex flex-col gap-4 rounded-xl border bg-card p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function EmptyState() {
  return <p className="py-10 text-center text-sm text-muted-foreground">لا توجد بيانات لعرضها</p>
}
