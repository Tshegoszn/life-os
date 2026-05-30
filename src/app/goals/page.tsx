'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, X, Star, Loader } from 'lucide-react'
import { Card, Button, Badge, ProgressBar, PageWrapper, Input, Select } from '@/components/ui'
import { supabase } from '@/lib/supabase'

type Milestone = { text: string; done: boolean }
type Goal = {
  id: string
  name: string
  category: string
  target: number
  current_value: number
  deadline: string
  milestones: Milestone[]
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
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'Business',
    target: '',
    current_value: '',
    deadline: '',
  })

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setGoals(data || [])
    setLoading(false)
  }

  const addGoal = async () => {
    if (!newGoal.name.trim()) return
    const payload = {
      name: newGoal.name,
      category: newGoal.category,
      target: Number(newGoal.target) || 100,
      current_value: Number(newGoal.current_value) || 0,
      deadline: newGoal.deadline || '2026-12-31',
      milestones: [],
    }
    const { data, error } = await supabase.from('goals').insert([payload]).select()
    if (error) console.error(error)
    else setGoals((gs) => [...(data || []), ...gs])
    setNewGoal({ name: '', category: 'Business', target: '', current_value: '', deadline: '' })
    setShowAdd(false)
  }

  const deleteGoal = async (id: string) => {
    setGoals((gs) => gs.filter((g) => g.id !== id))
    await supabase.from('goals').delete().eq('id', id)
  }

  const updateProgress = async (id: string, val: number) => {
    const goal = goals.find((g) => g.id === id)
    if (!goal) return
    const current_value = Math.min(val, goal.target)
    setGoals((gs) => gs.map((g) => g.id === id ? { ...g, current_value } : g))
    await supabase.from('goals').update({ current_value }).eq('id', id)
  }

  const toggleMilestone = async (gid: string, mi: number) => {
    const goal = goals.find((g) => g.id === gid)
    if (!goal) return
    const milestones = goal.milestones.map((m, i) =>
      i === mi ? { ...m, done: !m.done } : m
    )
    setGoals((gs) => gs.map((g) => g.id === gid ? { ...g, milestones } : g))
    await supabase.from('goals').update({ milestones }).eq('id', gid)
  }

  const addMilestone = async (gid: string, text: string) => {
    const goal = goals.find((g) => g.id === gid)
    if (!goal || !text.trim()) return
    const milestones = [...goal.milestones, { text, done: false }]
    setGoals((gs) => gs.map((g) => g.id === gid ? { ...g, milestones } : g))
    await supabase.from('goals').update({ milestones }).eq('id', gid)
  }

  if (loading) return (
    <PageWrapper title="Goal Tracker" subtitle="Dream big, act daily, achieve everything 🎯">
      <div className="flex items-center justify-center h-64">
        <Loader size={24} className="animate-spin" style={{ color: '#EA4C89' }} />
      </div>
    </PageWrapper>
  )

  return (
    <PageWrapper title="Goal Tracker" subtitle="Dream big, act daily, achieve everything 🎯">

      {/* Top bar */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-3 text-sm">
          <span style={{ color: '#888' }}>{goals.length} active goals</span>
          <span style={{ color: '#EA4C89' }}>
            · {goals.filter((g) => g.current_value >= g.target).length} completed
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
                <span className="text-xs font-medium" style={{ color: '#C73E74' }}>New goal</span>
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
                  value={newGoal.current_value}
                  onChange={(v) => setNewGoal((x) => ({ ...x, current_value: v }))}
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

      {/* Empty state */}
      {goals.length === 0 && (
        <div className="text-center py-16 text-xs" style={{ color: '#D8C1E8' }}>
          No goals yet — add your first one 🎯
        </div>
      )}

      {/* Goals grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = Math.min(100, Math.round((g.current_value / g.target) * 100))
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
                className={expanded ? 'ring-1 ring-[#EA4C89]' : ''}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge color={CAT_COLOR[g.category] || 'pink'}>{g.category}</Badge>
                      <span className="text-[10px]" style={{ color: '#888' }}>
                        by {g.deadline?.slice(0, 7)}
                      </span>
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                      {g.name}
                    </div>
                  </div>

                  {/* Progress circle */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="#FFEAF4" strokeWidth="5" />
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
                      <span className="text-xs font-semibold" style={{ color: '#EA4C89' }}>{pct}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex justify-between text-[11px] mb-1.5" style={{ color: '#888' }}>
                  <span>
                    {g.current_value > 100
                      ? `R${Number(g.current_value).toLocaleString()}`
                      : g.current_value}
                    {' / '}
                    {g.target > 100
                      ? `R${Number(g.target).toLocaleString()}`
                      : g.target}
                  </span>
                  <span style={{ color: '#EA4C89' }}>{pct}%</span>
                </div>
                <ProgressBar value={pct} />

                {/* Slider */}
                <div onClick={(e) => e.stopPropagation()} className="mt-2">
                  <input
                    type="range"
                    min={0}
                    max={g.target}
                    value={g.current_value}
                    onChange={(e) => updateProgress(g.id, Number(e.target.value))}
                    className="w-full h-1"
                    style={{ accentColor: '#EA4C89' }}
                  />
                </div>

                {/* Expanded milestones */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t"
                      style={{ borderColor: '#FFEAF4' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-[11px] font-medium mb-2 flex items-center gap-1" style={{ color: '#C73E74' }}>
                        <Star size={11} /> Milestones
                      </div>

                      {/* Milestone list */}
                      <div className="space-y-1.5 mb-3">
                        {g.milestones.length === 0 && (
                          <div className="text-[10px]" style={{ color: '#D8C1E8' }}>
                            No milestones yet — add one below
                          </div>
                        )}
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

                      {/* Add milestone */}
                      <MilestoneInput onAdd={(text) => addMilestone(g.id, text)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete */}
                <div className="flex justify-end mt-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="text-[10px] opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: '#C73E74' }}
                  >
                    Delete goal
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

function MilestoneInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            onAdd(value.trim())
            setValue('')
          }
        }}
        placeholder="Add milestone and press Enter..."
        className="flex-1 border rounded-xl px-2.5 py-1.5 text-[11px] focus:outline-none"
        style={{ borderColor: '#F5C8E2', background: '#FFF7FB', fontFamily: 'Outfit,sans-serif' }}
      />
      <button
        onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue('') } }}
        className="text-[10px] px-3 py-1.5 rounded-xl text-white"
        style={{ background: '#EA4C89' }}
      >
        Add
      </button>
    </div>
  )
}