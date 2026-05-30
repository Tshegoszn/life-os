'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart2, Users, CheckSquare, Star, Droplets,
  Smile, Calendar, Sparkles, TrendingUp, Plus, Loader,
} from 'lucide-react'
import { Card, Button, ProgressBar, StatCard, SectionHeader, PageWrapper } from '@/components/ui'
import { supabase } from '@/lib/supabase'

const QUOTES = [
  '"She remembered who she was and the game changed." — Lalah Delia',
  '"You are the CEO of your own life." — Unknown',
  '"Build the life you want, then live it." — Unknown',
  '"Do it with passion or not at all." — Rosa Nouchette Carey',
  '"Elegance is not about being noticed, it\'s about being remembered." — Giorgio Armani',
]
const MOODS = ['😩', '😔', '😐', '😊', '🤩']
const MOOD_LABELS = ['Awful', 'Low', 'Okay', 'Good', 'Amazing']
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function DashboardPage() {
  const today = new Date()
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const quote = QUOTES[today.getDay() % QUOTES.length]
  const todayStr = today.toISOString().slice(0, 10)

  // Live data from Supabase
  const [loading, setLoading] = useState(true)
  const [tasksDone, setTasksDone] = useState(0)
  const [tasksTotal, setTasksTotal] = useState(0)
  const [activeClients, setActiveClients] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [habits, setHabits] = useState<{ habit_name: string; days: number[] }[]>([])
  const [recentTasks, setRecentTasks] = useState<{ id: string; text: string; status: string }[]>([])
  const [financeSnap, setFinanceSnap] = useState({ income: 0, expenses: 0, savings: 0 })

  // Local state
  const [mood, setMood] = useState(3)
  const [water, setWater] = useState(0)
  const [newTask, setNewTask] = useState('')
  const [aiInput, setAiInput] = useState('')

  useEffect(() => {
    loadDashboardData()
    loadTodaySelfCare()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    const [tasksRes, clientsRes, txRes, habitsRes] = await Promise.all([
      supabase.from('tasks').select('id, text, status').order('created_at', { ascending: false }).limit(5),
      supabase.from('clients').select('id, status'),
      supabase.from('transactions').select('amount, type'),
      supabase.from('habit_logs').select('habit_name, days, streak').order('created_at', { ascending: true }),
    ])

    // Tasks
    if (tasksRes.data) {
      setRecentTasks(tasksRes.data)
      setTasksDone(tasksRes.data.filter((t) => t.status === 'done').length)
      setTasksTotal(tasksRes.data.length)
    }

    // Clients
    if (clientsRes.data) {
      setActiveClients(clientsRes.data.filter((c) => c.status === 'active').length)
    }

    // Finance
    if (txRes.data) {
      const income = txRes.data.filter((t) => t.type === 'income').reduce((a, b) => a + b.amount, 0)
      const expenses = txRes.data.filter((t) => t.type === 'expense').reduce((a, b) => a + b.amount, 0)
      setTotalIncome(income)
      setFinanceSnap({ income, expenses, savings: Math.max(0, income - expenses) })
    }

    // Habits
    if (habitsRes.data) {
      setHabits(habitsRes.data)
      if (habitsRes.data.length > 0) {
        setBestStreak(Math.max(...habitsRes.data.map((h: any) => h.streak || 0)))
      }
    }

    setLoading(false)
  }

  const loadTodaySelfCare = async () => {
    const { data } = await supabase
      .from('selfcare_logs')
      .select('water')
      .eq('date', todayStr)
      .single()
    if (data) setWater(data.water || 0)
  }

  const addTask = async () => {
    if (!newTask.trim()) return
    const payload = { text: newTask.trim(), priority: 'medium', tag: 'Personal', status: 'todo' }
    const { data } = await supabase.from('tasks').insert([payload]).select()
    if (data) {
      setRecentTasks((ts) => [...data, ...ts].slice(0, 5))
      setTasksTotal((n) => n + 1)
    }
    setNewTask('')
  }

  const toggleTask = async (id: string, status: string) => {
    const newStatus = status === 'done' ? 'todo' : 'done'
    setRecentTasks((ts) => ts.map((t) => t.id === id ? { ...t, status: newStatus } : t))
    if (newStatus === 'done') setTasksDone((n) => n + 1)
    else setTasksDone((n) => Math.max(0, n - 1))
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
  }

  const updateWater = async (val: number) => {
    setWater(val)
    await supabase.from('selfcare_logs').upsert(
      { date: todayStr, water: val, skincare_am: 0, skincare_pm: 0, wellness_score: 0, sleep_hours: 0, sleep_quality: 3 },
      { onConflict: 'date' }
    )
  }

  const calDays = Array.from({ length: 31 }, (_, i) => i + 1)
  const todayDate = today.getDate()
  const eventDays = [3, 7, 12, 18, 21, 26, 28]
  const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1
  const weekPct = habits.length > 0
    ? Math.round((habits.reduce((a, h) => a + h.days.filter(Boolean).length, 0) / (habits.length * 7)) * 100)
    : 0

  if (loading) return (
    <PageWrapper title={`${greeting}, Gorgeous ✨`} subtitle={today.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
      <div className="flex items-center justify-center h-64">
        <Loader size={24} className="animate-spin" style={{ color: '#EA4C89' }} />
      </div>
    </PageWrapper>
  )

  return (
    <PageWrapper
      title={`${greeting}, Gorgeous ✨`}
      subtitle={today.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
    >
      {/* Quote */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="mb-5 px-4 py-3 rounded-2xl text-xs italic"
        style={{ background: '#FFEAF4', borderLeft: '3px solid #EA4C89', color: '#C73E74' }}>
        {quote}
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Revenue MTD', value: `R${totalIncome.toLocaleString()}`, sub: 'Total income recorded', subUp: true, icon: <BarChart2 size={12} /> },
          { label: 'Active clients', value: String(activeClients), sub: 'From business page', icon: <Users size={12} /> },
          { label: 'Tasks done', value: `${tasksDone} / ${tasksTotal}`, sub: tasksTotal > 0 ? `${Math.round((tasksDone / tasksTotal) * 100)}% complete` : 'No tasks yet', icon: <CheckSquare size={12} /> },
          { label: 'Best streak', value: `${bestStreak} days 🔥`, sub: 'From habits page', subUp: true, icon: <Star size={12} /> },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Tasks */}
        <Card className="lg:col-span-1">
          <SectionHeader title="Recent tasks" icon={<CheckSquare size={13} />}
            action={<span className="text-[10px]" style={{ color: '#888' }}>{tasksDone}/{tasksTotal} done</span>} />
          <div className="space-y-1 mb-3">
            {recentTasks.length === 0 && (
              <div className="text-[11px] text-center py-4" style={{ color: '#D8C1E8' }}>No tasks yet 🌸</div>
            )}
            {recentTasks.map((t) => (
              <div key={t.id} onClick={() => toggleTask(t.id, t.status)}
                className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all"
                  style={{ background: t.status === 'done' ? '#EA4C89' : 'transparent', borderColor: t.status === 'done' ? '#EA4C89' : '#F5C8E2' }}>
                  {t.status === 'done' && <span className="text-white text-[9px]">✓</span>}
                </div>
                <span className={`text-xs transition-all ${t.status === 'done' ? 'line-through text-gray-300' : ''}`}
                  style={{ color: t.status === 'done' ? undefined : '#1A1A1A' }}>
                  {t.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a task..."
              className="flex-1 text-xs border rounded-xl px-2.5 py-1.5 focus:outline-none"
              style={{ borderColor: '#F5C8E2', background: '#FFF7FB', fontFamily: 'Outfit,sans-serif' }} />
            <Button onClick={addTask} className="!px-2.5"><Plus size={13} /></Button>
          </div>
        </Card>

        {/* Habits */}
        <Card className="lg:col-span-1">
          <SectionHeader title="Habit tracker" icon={<Star size={13} />}
            action={<span className="text-[10px]" style={{ color: '#888' }}>This week</span>} />
          {habits.length === 0 ? (
            <div className="text-[11px] text-center py-4" style={{ color: '#D8C1E8' }}>
              No habits yet — add some on the Habits page 🌸
            </div>
          ) : (
            <>
              <div className="flex gap-1 mb-2">
                {DAYS.map((d, i) => (
                  <div key={i} className="flex-1 text-center text-[9px] font-medium" style={{ color: '#D8C1E8' }}>{d}</div>
                ))}
              </div>
              <div className="space-y-2">
                {habits.slice(0, 4).map((h) => (
                  <div key={h.habit_name}>
                    <div className="text-[11px] mb-1" style={{ color: '#555' }}>{h.habit_name}</div>
                    <div className="flex gap-1">
                      {h.days.map((d, i) => (
                        <div key={i} className="flex-1 h-2.5 rounded-full"
                          style={{ background: d ? '#EA4C89' : '#FFEAF4', border: '0.5px solid #F5C8E2',
                            outline: i === todayIdx ? '1.5px solid #EA4C89' : 'none', outlineOffset: '1px' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] mb-1" style={{ color: '#888' }}>
                  <span>Weekly progress</span>
                  <span style={{ color: '#EA4C89' }}>{weekPct}%</span>
                </div>
                <ProgressBar value={weekPct} />
              </div>
            </>
          )}
        </Card>

        {/* Mood + Water */}
        <Card className="lg:col-span-1 flex flex-col gap-4">
          {/* Mood */}
          <div>
            <SectionHeader title="Mood check-in" icon={<Smile size={13} />} />
            <div className="flex gap-2 justify-center py-1">
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => setMood(i)} title={MOOD_LABELS[i]}
                  className="w-9 h-9 rounded-full text-xl flex items-center justify-center border transition-all"
                  style={{
                    borderColor: mood === i ? '#EA4C89' : '#F5C8E2',
                    background: mood === i ? '#FFEAF4' : 'transparent',
                    transform: mood === i ? 'scale(1.15)' : 'scale(1)',
                    opacity: mood === i ? 1 : 0.6,
                  }}>
                  {m}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-center mt-1" style={{ color: '#C73E74' }}>
              Feeling {MOOD_LABELS[mood].toLowerCase()} today 🌸
            </p>
          </div>

          {/* Water */}
          <div>
            <SectionHeader title="Water tracker" icon={<Droplets size={13} />}
              action={<span className="text-[10px]" style={{ color: '#888' }}>Goal: 8 glasses</span>} />
            <div className="flex gap-1.5 justify-center">
              {Array.from({ length: 8 }, (_, i) => (
                <button key={i} onClick={() => updateWater(i + 1)}
                  className="w-7 h-9 rounded-b-sm border transition-all"
                  style={{ borderColor: '#D8C1E8', background: i < water ? '#D8C1E8' : '#FFEAF4' }} />
              ))}
            </div>
            <p className="text-[10px] text-center mt-1" style={{ color: '#C73E74' }}>{water} / 8 glasses</p>
            <div className="mt-1"><ProgressBar value={water} max={8} color="lav" height={4} /></div>
          </div>
        </Card>

        {/* Calendar preview */}
        <Card className="lg:col-span-1">
          <SectionHeader title={today.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })} icon={<Calendar size={13} />} />
          <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <div key={d} className="text-[9px] font-medium py-0.5" style={{ color: '#D8C1E8' }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {[0, 1, 2, 3].map((i) => <div key={'e' + i} />)}
            {calDays.map((d) => (
              <div key={d} className="text-[10px] text-center py-1 rounded cursor-default"
                style={{
                  background: d === todayDate ? '#EA4C89' : 'transparent',
                  color: d === todayDate ? '#fff' : eventDays.includes(d) ? '#C73E74' : '#aaa',
                  fontWeight: d === todayDate || eventDays.includes(d) ? 600 : 400,
                }}>
                {d}
              </div>
            ))}
          </div>
        </Card>

        {/* Finance snapshot */}
        <Card className="lg:col-span-1">
          <SectionHeader title="Finance snapshot" icon={<TrendingUp size={13} />} />
          {[
            { label: 'Income recorded', value: `+ R${financeSnap.income.toLocaleString()}`, pos: true },
            { label: 'Expenses recorded', value: `− R${financeSnap.expenses.toLocaleString()}`, pos: false },
            { label: 'Net profit', value: `R${financeSnap.savings.toLocaleString()}`, pos: null },
            { label: 'Active clients', value: String(activeClients), pos: null },
          ].map((r) => (
            <div key={r.label} className="flex justify-between items-center py-1.5 border-b last:border-0 text-xs"
              style={{ borderColor: '#FFEAF4' }}>
              <span style={{ color: '#555' }}>{r.label}</span>
              <span style={{ color: r.pos === true ? '#3B6D11' : r.pos === false ? '#A32D2D' : '#1A1A1A', fontWeight: 500 }}>
                {r.value}
              </span>
            </div>
          ))}
          {financeSnap.income > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1" style={{ color: '#888' }}>
                <span>Profit margin</span>
                <span style={{ color: '#EA4C89' }}>
                  {Math.round((financeSnap.savings / financeSnap.income) * 100)}%
                </span>
              </div>
              <ProgressBar value={financeSnap.savings} max={financeSnap.income} />
            </div>
          )}
        </Card>

        {/* AI assistant */}
        <Card className="lg:col-span-1">
          <SectionHeader title="AI assistant" icon={<Sparkles size={13} />} />
          <textarea value={aiInput} onChange={(e) => setAiInput(e.target.value)}
            placeholder="Ask me anything — plan my day, write a caption, business insight..."
            rows={3} className="w-full text-xs border rounded-xl px-3 py-2 resize-none focus:outline-none"
            style={{ borderColor: '#F5C8E2', background: '#FFF7FB', fontFamily: 'Outfit,sans-serif', color: '#1A1A1A' }} />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['Plan my day', 'Write caption', 'Business insight', 'Journal prompt'].map((chip) => (
              <button key={chip} onClick={() => setAiInput(chip)}
                className="text-[10px] px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:bg-[#EA4C89]/10"
                style={{ borderColor: '#F5C8E2', color: '#C73E74', background: '#FBEAF0' }}>
                {chip}
              </button>
            ))}
          </div>
          <Button className="w-full mt-2 justify-center" onClick={() => setAiInput('')}>
            <Sparkles size={12} /> Ask Claude
          </Button>
        </Card>

      </div>
    </PageWrapper>
  )
}