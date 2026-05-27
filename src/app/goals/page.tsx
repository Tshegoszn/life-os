'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, X, Star } from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  ProgressBar,
  SectionHeader,
  PageWrapper,
  Input,
  Select,
} from '@/components/ui'

type Goal = {
  id: number
  name: string
  category: string
  target: number
  current: number
  deadline: string
  milestones: { text: string; done: boolean }[]
}

const CATEGORIES = ['Business', 'Finance', 'Personal', 'Fitness', 'Mindset', 'Creative']

const CAT_COLOR: Record<string, 'pink' | 'green' | 'yellow' | 'lav' | 'red' | 'gray'> = {
  Business: 'pink',
  Finance: 'green',
  Personal: 'lav',
  Fitness: 'red',
  Mindset: 'yellow',
  Creative: 'lav',
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: 'Hit R32k monthly revenue',
      category: 'Business',
      target: 32000,
      current: 24800,
      deadline: '2026-12-31',
      milestones: [
        { text: 'First R10k month', done: true },
        { text: 'First R20k month', done: true },
        { text: 'First retainer client', done: true },
        { text: 'R32k month', done: false },
      ],
    },
    {
      id: 2,
      name: 'Build emergency fund R20k',
      category: 'Finance',
      target: 20000,
      current: 14500,
      deadline: '2026-09-30',
      milestones: [
        { text: 'Save first R5,000', done: true },
        { text: 'Reach R10,000', done: true },
        { text: 'Hit R15,000', done: false },
        { text: 'Full R20,000', done: false },
      ],
    },
    {
      id: 3,
      name: 'Reach 10k TikTok followers',
      category: 'Business',
      target: 10000,
      current: 6200,
      deadline: '2026-08-01',
      milestones: [
        { text: '1k followers', done: true },
        { text: '5k followers', done: true },
        { text: 'First viral video', done: false },
        { text: '10k followers', done: false },
      ],
    },
    {
      id: 4,
      name: 'Run 5km without stopping',
      category: 'Fitness',
      target: 5,
      current: 3.2,
      deadline: '2026-07-01',
      milestones: [
        { text: 'Run 1km', done: true },
        { text: 'Run 2km', done: true },
        { text: 'Run 3km', done: true },
        { text: 'Run 5km', done: false },
      ],
    },
    {
      id: 5,
      name: 'Read 12 books this year',
      category: 'Mindset',
      target: 12,
      current: 5,
      deadline: '2026-12-31',
      milestones: [
        { text: 'Read 3 books', done: true },
        { text: 'Read 6 books', done: false },
        { text: 'Read 9 books', done: false },
        { text: 'Read 12 books', done: false },
      ],
    },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'Business',
    target: '',
    current: '',
    deadline: '',
  })

  const addGoal = () => {
    if (!newGoal.name.trim()) return
    setGoals((gs) => [
      ...gs,
      {
        id: Date.now(),
        name: newGoal.name,
        category: newGoal.category,
        target: Number(newGoal.target) || 100,
        current: Number(newGoal.current) || 0,
        deadline: newGoal.deadline || '2026-12-31',
        milestones: [],
      },
    ])
    setNewGoal({ name: '', category: 'Business', target: '', current: '', deadline: '' })
    setShowAdd(false)
  }

  const toggleMilestone = (gid: number, mi: number) =>
    setGoals((gs) =>
      gs.map((g) =>
        g.id === gid
          ? {
              ...g,
              milestones: g.milestones.map((m, i) =>
                i === mi ? { ...m, done: !m.done } : m
              ),
            }
          : g
      )
    )

  const updateProgress = (id: number, val: number) =>
    setGoals((gs) =>
      gs.map((g) => (g.id === id ? { ...g, current: Math.min(val, g.target) } : g))
    )

  const deleteGoal = (id: number) =>
    setGoals((gs) => gs.filter((g) => g.id !== id))

  return (
    <PageWrapper title="Goal Tracker" subtitle="Dream big, act daily, achieve everything 🎯">

      {/* Top bar */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-3 text-sm">
          <span style={{ color: '#888' }}>{goals.length} active goals</span>
          <span style={{ color: '#EA4C89' }}>
            · {goals.filter((g) => g.current >= g.target).length} completed
          </span>
        </div>
        <Button onClick={() => setShowAdd((v) => !v)}>
          <Plus size={13} /> New goal
        </Button>
      </div>

      {/* Add goal form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <Card>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium" style={{ color: '#C73E74' }}>
                  New goal
                </span>
                <button onClick={() => setShowAdd(false)}>
                  <X size={14} style={{ color: '#C73E74' }} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="col-span-2">
                  <Input
                    label="Goal"
                    value={newGoal.name}
                    onChange={(v) => setNewGoal((x) => ({ ...x, name: v }))}
                    placeholder="e.g. Hit R50k monthly revenue"
                  />
                </div>
                <Select
                  label="Category"
                  value={newGoal.category}
                  onChange={(v) => setNewGoal((x) => ({ ...x, category: v }))}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
                <Input
                  label="Target"
                  value={newGoal.target}
                  onChange={(v) => setNewGoal((x) => ({ ...x, target: v }))}
                  type="number"
                  placeholder="32000"
                />
                <Input
                  label="Current progress"
                  value={newGoal.current}
                  onChange={(v) => setNewGoal((x) => ({ ...x, current: v }))}
                  type="number"
                  placeholder="0"
                />
                <Input
                  label="Deadline"
                  value={newGoal.deadline}
                  onChange={(v) => setNewGoal((x) => ({ ...x, deadline: v }))}
                  type="date"
                />
              </div>
              <Button onClick={addGoal}>Save goal</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = Math.round((g.current / g.target) * 100)
          const expanded = expandedId === g.id
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                hover
                onClick={() => setExpandedId(expanded ? null : g.id)}
                style={expanded ? { borderColor: '#EA4C89', borderWidth: 1 } : {}}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge color={CAT_COLOR[g.category] || 'pink'}>
                        {g.category}
                      </Badge>
                      <span className="text-[10px]" style={{ color: '#888' }}>
                        by {g.deadline.slice(0, 7)}
                      </span>
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                      {g.name}
                    </div>
                  </div>

                  {/* Progress circle */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                      <circle
                        cx="28" cy="28" r="22"
                        fill="none" stroke="#FFEAF4" strokeWidth="5"
                      />
                      <circle
                        cx="28" cy="28" r="22"
                        fill="none" stroke="#EA4C89" strokeWidth="5"
                        strokeDasharray={`${2 * Math.PI * 22}`}
                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold" style={{ color: '#EA4C89' }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="flex justify-between text-[11px] mb-1.5"
                  style={{ color: '#888' }}
                >
                  <span>
                    {g.current > 100
                      ? `R${g.current.toLocaleString()}`
                      : g.current}{' '}
                    /{' '}
                    {g.target > 100
                      ? `R${g.target.toLocaleString()}`
                      : g.target}
                  </span>
                  <span style={{ color: '#EA4C89' }}>{pct}%</span>
                </div>
                <ProgressBar value={pct} />

                {/* Slider */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2"
                >
                  <input
                    type="range"
                    min={0}
                    max={g.target}
                    value={g.current}
                    onChange={(e) => updateProgress(g.id, Number(e.target.value))}
                    className="w-full h-1"
                    style={{ accentColor: '#EA4C89' }}
                  />
                </div>

                {/* Milestones */}
                <AnimatePresence>
                  {expanded && g.milestones.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t"
                      style={{ borderColor: '#FFEAF4' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="text-[11px] font-medium mb-2 flex items-center gap-1"
                        style={{ color: '#C73E74' }}
                      >
                        <Star size={11} /> Milestones
                      </div>
                      <div className="space-y-1.5">
                        {g.milestones.map((m, mi) => (
                          <div
                            key={mi}
                            onClick={() => toggleMilestone(g.id, mi)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] border transition-all"
                              style={{
                                background: m.done ? '#EA4C89' : 'transparent',
                                borderColor: m.done ? '#EA4C89' : '#F5C8E2',
                                color: '#fff',
                              }}
                            >
                              {m.done && '✓'}
                            </div>
                            <span
                              className={`text-[11px] ${m.done ? 'line-through text-gray-300' : ''}`}
                              style={{ color: m.done ? undefined : '#555' }}
                            >
                              {m.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete button */}
                <div
                  className="flex justify-end mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="text-[10px] opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: '#C73E74' }}
                  >
                    Delete
                  </button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </PageWrapper>
  )
}