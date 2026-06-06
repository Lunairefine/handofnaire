'use client'

import { cn } from '@/lib/utils'

export type SenderType = 'one-to-many' | 'many-to-one' | 'many-to-many'

interface MultisenderTypeProps {
  selected: SenderType
  onSelect: (type: SenderType) => void
}

const types: { id: SenderType; title: string; desc: string }[] = [
  { id: 'one-to-many', title: 'One to Many', desc: '1 Sender → Multiple Receivers' },
  { id: 'many-to-one', title: 'Many to One', desc: 'Multiple Senders → 1 Receiver' },
  { id: 'many-to-many', title: 'Many to Many', desc: 'Multiple Senders → Multiple Receivers' },
]

export default function MultisenderType({ selected, onSelect }: MultisenderTypeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={cn(
            "p-4 text-left rounded-[1px] border transition-all duration-200",
            selected === type.id
              ? "border-teal-500 bg-teal-500/10"
              : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <h3 className={cn("font-medium", selected === type.id ? "text-teal-600 dark:text-teal-400" : "text-[var(--text-primary)]")}>
            {type.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{type.desc}</p>
        </button>
      ))}
    </div>
  )
}
