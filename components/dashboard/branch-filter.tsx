'use client'

import { useState, useRef, useEffect } from 'react'
import { Store, ChevronDown, Check } from 'lucide-react'

export const ALL_RESTAURANTS = 'جميع المطاعم'
// للإبقاء على التوافقية السابقة
export const ALL_BRANCHES = ALL_RESTAURANTS

interface RestaurantFilterProps {
  restaurants?: string[]
  branches?: string[] // للتوافقية إن تم تمريرها بالاسم القديم
  value: string
  onChange: (value: string) => void
}

export function BranchFilter({ restaurants, branches, value, onChange }: RestaurantFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const items = restaurants || branches || []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-sm hover:border-blue-500/50 transition-all cursor-pointer"
      >
        <Store className="size-4 text-blue-500" />
        <span>{value}</span>
        <ChevronDown className={`size-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={() => {
              onChange(ALL_RESTAURANTS)
              setIsOpen(false)
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              value === ALL_RESTAURANTS
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <span>جميع المطاعم</span>
            {value === ALL_RESTAURANTS && <Check className="size-3.5" />}
          </button>

          <div className="my-1.5 border-t border-slate-100 dark:border-white/5" />

          {items.map((restName) => (
            <button
              key={restName}
              onClick={() => {
                onChange(restName)
                setIsOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                value === restName
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="truncate">{restName}</span>
              {value === restName && <Check className="size-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
