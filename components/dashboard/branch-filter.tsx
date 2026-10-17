'use client'

import { useState } from 'react'
import { MapPin, ChevronDown, Store } from 'lucide-react'

export const ALL_BRANCHES = 'جميع الفروع والمطاعم'

interface BranchFilterProps {
  branches: string[]
  value: string
  onChange: (val: string) => void
}

export function BranchFilter({ branches, value, onChange }: BranchFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
      >
        <Store className="size-4 text-blue-500" />
        <span className="max-w-[180px] truncate">{value || ALL_BRANCHES}</span>
        <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 p-2 max-h-72 overflow-y-auto">
            <button
              onClick={() => { onChange(ALL_BRANCHES); setIsOpen(false); }}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                value === ALL_BRANCHES
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {ALL_BRANCHES}
            </button>
            
            <div className="my-1 border-t border-slate-100 dark:border-white/10"></div>

            {branches.map((b, i) => (
              <button
                key={i}
                onClick={() => { onChange(b); setIsOpen(false); }}
                className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-all truncate ${
                  value === b
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}