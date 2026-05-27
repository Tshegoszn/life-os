'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Star,
  Wallet,
  Camera,
  Target,
  BookOpen,
  CheckSquare,
  Heart,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/business', icon: Briefcase, label: 'Business' },
  { href: '/habits', icon: Star, label: 'Habits' },
  { href: '/finance', icon: Wallet, label: 'Finance' },
  { href: '/content', icon: Camera, label: 'Content' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/journal', icon: BookOpen, label: 'Journal' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/selfcare', icon: Heart, label: 'Self-Care' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.aside
      animate={{ width: expanded ? 220 : 64 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col overflow-hidden"
      style={{ background: '#FFEAF4', borderRight: '0.5px solid #F5C8E2' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-3 py-4 border-b flex-shrink-0"
        style={{ borderColor: '#F5C8E2' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg, #EA4C89, #D8C1E8)',
            fontFamily: 'Playfair Display, serif',
          }}
        >
          L
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-sm whitespace-nowrap"
              style={{ fontFamily: 'Playfair Display, serif', color: '#C73E74' }}
            >
              Life OS
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-hidden">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}>
              <div
                className="flex items-center gap-3 mx-2 my-0.5 px-2.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
                style={{
                  background: active ? 'rgba(234,76,137,0.12)' : 'transparent',
                  color: active ? '#EA4C89' : '#C73E74',
                }}
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="text-xs font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom — settings + avatar */}
      <div
        className="py-3 border-t flex-shrink-0"
        style={{ borderColor: '#F5C8E2' }}
      >
        <div
          className="flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-xl cursor-pointer hover:bg-[#EA4C89]/10 transition-all"
          style={{ color: '#C73E74' }}
        >
          <Settings size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-medium whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div
          className="flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-xl cursor-pointer"
          style={{ color: '#C73E74' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg,#EA4C89,#D8C1E8)' }}
          >
            T
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-medium whitespace-nowrap"
              >
                Tshego
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}