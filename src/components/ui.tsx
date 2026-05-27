'use client'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

/* ─── Card ─────────────────────────────────────────────── */
export function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 8px 32px rgba(234,76,137,0.13)' } : {}}
      onClick={onClick}
      className={clsx('glass rounded-2xl p-4', hover && 'cursor-pointer', className)}
    >
      {children}
    </motion.div>
  )
}

/* ─── Button ────────────────────────────────────────────── */
export function Button({
  children,
  onClick,
  variant = 'pink',
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'pink' | 'ghost' | 'lav'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const base =
    'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer'
  const variants = {
    pink: 'bg-[#EA4C89] text-white hover:bg-[#C73E74]',
    ghost: 'bg-transparent border border-[#F5C8E2] text-[#C73E74] hover:bg-[#FFEAF4]',
    lav: 'bg-[#D8C1E8]/30 text-[#7B5EA7] hover:bg-[#D8C1E8]/60 border border-[#D8C1E8]',
  }
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
    >
      {children}
    </motion.button>
  )
}

/* ─── Badge ─────────────────────────────────────────────── */
export function Badge({
  children,
  color = 'pink',
}: {
  children: React.ReactNode
  color?: 'pink' | 'green' | 'yellow' | 'red' | 'lav' | 'gray'
}) {
  const colors = {
    pink: 'bg-[#FBEAF0] text-[#72243E]',
    green: 'bg-[#EAF3DE] text-[#27500A]',
    yellow: 'bg-[#FAEEDA] text-[#633806]',
    red: 'bg-[#FCEBEB] text-[#791F1F]',
    lav: 'bg-[#EEE8F5] text-[#5A3D7A]',
    gray: 'bg-[#F1EFE8] text-[#555]',
  }
  return (
    <span
      className={clsx(
        'inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full',
        colors[color]
      )}
    >
      {children}
    </span>
  )
}

/* ─── ProgressBar ───────────────────────────────────────── */
export function ProgressBar({
  value,
  max = 100,
  color = 'pink',
  height = 6,
}: {
  value: number
  max?: number
  color?: 'pink' | 'lav' | 'green'
  height?: number
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const fills = {
    pink: 'linear-gradient(90deg,#EA4C89,#D8C1E8)',
    lav: 'linear-gradient(90deg,#D8C1E8,#EA4C89)',
    green: 'linear-gradient(90deg,#6BBF4E,#A8E063)',
  }
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: '#FFEAF4' }}
    >
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ background: fills[color] }}
      />
    </div>
  )
}

/* ─── StatCard ──────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  sub,
  subUp,
  icon,
}: {
  label: string
  value: string
  sub?: string
  subUp?: boolean
  icon?: React.ReactNode
}) {
  return (
    <Card>
      <div
        className="text-[11px] flex items-center gap-1.5 mb-1"
        style={{ color: '#C73E74' }}
      >
        {icon}
        {label}
      </div>
      <div className="text-xl font-semibold" style={{ color: '#1A1A1A' }}>
        {value}
      </div>
      {sub && (
        <div
          className={`text-[10px] mt-1 ${
            subUp === true
              ? 'text-green-700'
              : subUp === false
              ? 'text-red-700'
              : 'text-gray-400'
          }`}
        >
          {sub}
        </div>
      )}
    </Card>
  )
}

/* ─── SectionHeader ─────────────────────────────────────── */
export function SectionHeader({
  title,
  icon,
  action,
}: {
  title: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div
        className="flex items-center gap-2 text-xs font-medium"
        style={{ color: '#C73E74' }}
      >
        {icon}
        <span>{title}</span>
      </div>
      {action}
    </div>
  )
}

/* ─── PageWrapper ───────────────────────────────────────── */
export function PageWrapper({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 max-w-7xl"
    >
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A1A' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: '#C73E74' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  )
}

/* ─── Input ─────────────────────────────────────────────── */
export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label?: string
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          className="text-[11px] font-medium"
          style={{ color: '#C73E74' }}
        >
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#EA4C89] transition-colors"
        style={{
          borderColor: '#F5C8E2',
          background: '#FFF7FB',
          color: '#1A1A1A',
          fontFamily: 'Outfit, sans-serif',
        }}
      />
    </div>
  )
}

/* ─── Select ─────────────────────────────────────────────── */
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          className="text-[11px] font-medium"
          style={{ color: '#C73E74' }}
        >
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#EA4C89]"
        style={{
          borderColor: '#F5C8E2',
          background: '#FFF7FB',
          color: '#1A1A1A',
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}