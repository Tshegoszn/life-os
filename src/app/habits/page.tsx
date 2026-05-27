'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Plus, X, Flame, Sun, Moon } from 'lucide-react'
import {
  Card,
  Button,
  ProgressBar,
  SectionHeader,
  PageWrapper,
  Input,
} from '@/components/ui'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type Habit = {
  id: number
  name: string
  days: number[]
  streak: number
  category: 'morning' | 'evening' | 'daily'
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: 'Morning routine', days: [1,1,1,1,1,0,0], streak: 12, category: 'morning' },
    { id: 2, name: 'Workout 30 min', days: [1,0,1,1,0,0,0], streak: 4, category: 'daily' },
    { id: 3, name: 'Drink 2L water', days: [1,1,0,1,1,0,0], streak: 8, category: 'daily' },
    { id: 4, name: 'Journaling', days: [1,1,1,0,1,0,0], streak: 6, category: 'evening' },
    { id: 5, name: 'Reading 20 min', days: [0,1,1,1,1,0,0], streak: 5, category: 'evening' },
    { id: 6, name: 'Skincare routine', days: [1,1,1,1,1,1,0], streak: 14, category: 'evening' },
  ])

  const [morning, setMorning] = useState([
    { id: 1, text: 'Wake up by 6:30am', done: true },
    { id: 2, text: 'Drink warm lemon water', done: true },
    { id: 3, text: 'Workout or stretch', done: false },
    { id: 4, text: 'Shower & get ready', done: false },
    { id: 5, text: 'Healthy breakfast', done: false },
    { id: 6, text: 'Plan the day — 3 priorities', done: false },
  ])

  const [evening, setEvening] = useState([
    { id: 1, text: 'Tidy workspace', done: false },
    { id: 2, text: 'Review today\'s wins', done: false },
    { id: 3, text: 'Skincare routine', done: false },
    { id: 4, text: 'Journal entry', done: false },
    { id: 5, text: 'Read 20 minutes', done: false },
    { id: 6, text: 'In bed by 10:30pm', done: false },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'daily' as Habit['category'],
  })

  const toggleDay = (hid: number, di: number) =>
    setHabits((hs) =>
      hs.map((h) =>
        h.id === hid
          ? { ...h, days: h.days.map((d, i) => (i === di ? (d ? 0 : 1) : d)) }
          : h
      )
    )

  const addHabit = () => {
    if (!newHabit.name.trim()) return
    setHabits((hs) => [
      ...hs,
      {
        id: Date.now(),
        name: newHabit.name,
        days: [0, 0, 0, 0, 0, 0, 0],
        streak: 0,
        category: newHabit.category,
      },
    ])
    setNewHabit({ name: '', category: 'daily' })
    setShowAdd(false)
  }

  const totalDots = habits.reduce((a, h) => a + h.days.length, 0)
  const filledDots = habits.reduce((a, h) => a + h.days.filter(Boolean).length, 0)
  const weekPct = Math.round((filledDots / totalDots) * 100)

  const todayIdx =
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const todayDone = habits.filter((h) => h.days[todayIdx]).length

  return (
    <PageWrapper
      title="Habit & Routine Tracker"
      subtitle="Build the life you want, one habit at a time 🌸"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Today's habits",
            value: `${todayDone}/${habits.length}`,
            sub: 'Completed today',
          },
          {
            label: 'Best streak',
            value: `${Math.max(...habits.map((h) => h.streak))} days 🔥`,
            sub: 'Skincare routine',
          },
          {
            label: 'Weekly score',
            value: `${weekPct}%`,
            sub: 'This week',
          },
          {
            label: 'Total habits',
            value: String(habits.length),
            sub: `${habits.filter((h) => h.category === 'morning').length} morning · ${habits.filter((h) => h.category === 'evening').length} evening`,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <div className="text-[11px] mb-1" style={{ color: '#C73E74' }}>
                {s.label}
              </div>
              <div className="text-xl font-semibold">{s.value}</div>
              <div className="text-[10px] mt-1 text-gray-400">{s.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Morning routine */}
        <Card>
          <SectionHeader
            title="Morning routine"
            icon={<Sun size={13} />}
            action={
              <span className="text-[10px]" style={{ color: '#888' }}>
                {morning.filter((t) => t.done).length}/{morning.length}
              </span>
            }
          />
          <div className="space-y-1.5">
            {morning.map((t) => (
              <div
                key={t.id}
                onClick={() =>
                  setMorning((m) =>
                    m.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x))
                  )
                }
                className="flex items-center gap-2.5 py-1 cursor-pointer"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border transition-all text-[10px]"
                  style={{
                    background: t.done ? '#EA4C89' : 'transparent',
                    borderColor: t.done ? '#EA4C89' : '#F5C8E2',
                    color: '#fff',
                  }}
                >
                  {t.done && '✓'}
                </div>
                <span
                  className={`text-xs ${t.done ? 'line-through text-gray-300' : ''}`}
                  style={{ color: t.done ? undefined : '#555' }}
                >
                  {t.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <ProgressBar value={morning.filter((t) => t.done).length} max={morning.length} />
          </div>
        </Card>

        {/* Evening routine */}
        <Card>
          <SectionHeader
            title="Evening routine"
            icon={<Moon size={13} />}
            action={
              <span className="text-[10px]" style={{ color: '#888' }}>
                {evening.filter((t) => t.done).length}/{evening.length}
              </span>
            }
          />
          <div className="space-y-1.5">
            {evening.map((t) => (
              <div
                key={t.id}
                onClick={() =>
                  setEvening((e) =>
                    e.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x))
                  )
                }
                className="flex items-center gap-2.5 py-1 cursor-pointer"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border transition-all text-[10px]"
                  style={{
                    background: t.done ? '#D8C1E8' : 'transparent',
                    borderColor: t.done ? '#D8C1E8' : '#F5C8E2',
                    color: '#fff',
                  }}
                >
                  {t.done && '✓'}
                </div>
                <span
                  className={`text-xs ${t.done ? 'line-through text-gray-300' : ''}`}
                  style={{ color: t.done ? undefined : '#555' }}
                >
                  {t.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <ProgressBar
              value={evening.filter((t) => t.done).length}
              max={evening.length}
              color="lav"
            />
          </div>
        </Card>

        {/* Weekly habit grid */}
        <Card className="lg:row-span-2">
          <SectionHeader
            title="Weekly habit grid"
            icon={<Star size={13} />}
            action={
              <Button variant="ghost" onClick={() => setShowAdd((v) => !v)}>
                <Plus size={12} />
              </Button>
            }
          />

          {/* Add habit form */}
          <AnimatePresence>
            {showAdd && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div
                  className="p-3 rounded-2xl"
                  style={{ background: '#FFF7FB', border: '0.5px solid #F5C8E2' }}
                >
                  <Input
                    label="Habit name"
                    value={newHabit.name}
                    onChange={(v) => setNewHabit((n) => ({ ...n, name: v }))}
                    placeholder="e.g. Meditate 10 min"
                  />
                  <div className="flex gap-2 mt-2">
                    {(['morning', 'daily', 'evening'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewHabit((n) => ({ ...n, category: c }))}
                        className="text-[10px] px-2 py-1 rounded-full border transition-all capitalize"
                        style={{
                          background: newHabit.category === c ? '#EA4C89' : 'transparent',
                          color: newHabit.category === c ? '#fff' : '#888',
                          borderColor: newHabit.category === c ? '#EA4C89' : '#F5C8E2',
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={addHabit}>Add</Button>
                    <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div />
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-[9px] text-center font-medium"
                style={{ color: '#D8C1E8' }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Habit rows */}
          <div className="space-y-2">
            {habits.map((h) => (
              <div key={h.id} className="grid grid-cols-8 gap-1 items-center">
                <div
                  className="text-[10px] truncate pr-1"
                  style={{ color: '#555' }}
                  title={h.name}
                >
                  {h.name.split(' ')[0]}
                </div>
                {h.days.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(h.id, i)}
                    className="h-6 rounded transition-all"
                    style={{
                      background: d
                        ? h.category === 'evening'
                          ? '#D8C1E8'
                          : '#EA4C89'
                        : '#FFEAF4',
                      border: '0.5px solid #F5C8E2',
                      outline: i === todayIdx ? '2px solid #EA4C89' : 'none',
                      outlineOffset: '1px',
                    }}
                    title={`${h.name} — ${DAYS[i]}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Weekly progress */}
          <div className="mt-4">
            <div
              className="flex justify-between text-[10px] mb-1"
              style={{ color: '#888' }}
            >
              <span>Weekly completion</span>
              <span style={{ color: '#EA4C89' }}>{weekPct}%</span>
            </div>
            <ProgressBar value={weekPct} />
          </div>

          {/* Streaks */}
          <div className="mt-4">
            <div
              className="text-[11px] font-medium mb-2 flex items-center gap-1"
              style={{ color: '#C73E74' }}
            >
              <Flame size={12} /> Streaks
            </div>
            <div className="space-y-1.5">
              {[...habits]
                .sort((a, b) => b.streak - a.streak)
                .slice(0, 4)
                .map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span style={{ color: '#555' }}>{h.name}</span>
                    <span className="font-medium" style={{ color: '#EA4C89' }}>
                      {h.streak}d 🔥
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </Card>

        {/* Weekly performance chart */}
        <Card className="lg:col-span-2">
          <SectionHeader
            title="This week's performance"
            icon={<Star size={13} />}
          />
          <div className="flex items-end gap-2 h-20">
            {DAYS.map((d, i) => {
              const dayDone = habits.filter((h) => h.days[i]).length
              const pct = Math.round((dayDone / habits.length) * 100)
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[9px]" style={{ color: '#888' }}>
                    {pct}%
                  </div>
                  <motion.div
                    className="w-full rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${pct * 0.55}px` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    style={{
                      background: i === todayIdx ? '#EA4C89' : '#F5C8E2',
                      minHeight: 4,
                    }}
                  />
                  <div
                    className="text-[9px]"
                    style={{ color: i === todayIdx ? '#EA4C89' : '#aaa' }}
                  >
                    {d}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

      </div>
    </PageWrapper>
  )
}

