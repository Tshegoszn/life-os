'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart2,
  Users,
  CheckSquare,
  Star,
  Droplets,
  Smile,
  Calendar,
  Sparkles,
  TrendingUp,
  Plus,
} from 'lucide-react'
import {
  Card,
  Button,
  ProgressBar,
  StatCard,
  SectionHeader,
  PageWrapper,
} from '@/components/ui'

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
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const quote = QUOTES[today.getDay() % QUOTES.length]

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Send Lena her brand proposal', done: true },
    { id: 2, text: 'Post Monday reel', done: true },
    { id: 3, text: 'Review Supabase schema', done: false },
    { id: 4, text: 'Client call — Zara at 3pm', done: false },
    { id: 5, text: 'Write 3 TikTok caption drafts', done: false },
  ])
  const [newTask, setNewTask] = useState('')
  const [mood, setMood] = useState(3)
  const [water, setWater] = useState(5)
  const [aiInput, setAiInput] = useState('')

  const toggleTask = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))

  const addTask = () => {
    if (!newTask.trim()) return
    setTasks((t) => [...t, { id: Date.now(), text: newTask.trim(), done: false }])
    setNewTask('')
  }

  const doneTasks = tasks.filter((t) => t.done).length

  const habits = [
    { name: 'Morning routine', days: [1, 1, 1, 1, 1, 0, 0] },
    { name: 'Workout', days: [1, 0, 1, 1, 0, 0, 0] },
    { name: '2L water', days: [1, 1, 0, 1, 1, 0, 0] },
    { name: 'Journaling', days: [1, 1, 1, 0, 1, 0, 0] },
  ]

  const calDays = Array.from({ length: 31 }, (_, i) => i + 1)
  const todayDate = today.getDate()
  const eventDays = [3, 7, 12, 18, 21, 26, 28]

  return (
    <PageWrapper
      title={`${greeting}, Gorgeous ✨`}
      subtitle={today.toLocaleDateString('en-ZA', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    >
      {/* Quote bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-5 px-4 py-3 rounded-2xl text-xs italic"
        style={{
          background: '#FFEAF4',
          borderLeft: '3px solid #EA4C89',
          color: '#C73E74',
        }}
      >
        {quote}
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: 'Revenue MTD',
            value: 'R24,800',
            sub: '↑ 18% vs last month',
            subUp: true,
            icon: <BarChart2 size={12} />,
          },
          {
            label: 'Active clients',
            value: '6',
            sub: '2 new this month',
            icon: <Users size={12} />,
          },
          {
            label: 'Tasks done today',
            value: `${doneTasks} / ${tasks.length}`,
            sub: `${Math.round((doneTasks / tasks.length) * 100)}% complete`,
            icon: <CheckSquare size={12} />,
          },
          {
            label: 'Habit streak',
            value: '12 days 🔥',
            sub: 'Personal best!',
            subUp: true,
            icon: <Star size={12} />,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Tasks */}
        <Card className="lg:col-span-1">
          <SectionHeader
            title="Today's tasks"
            icon={<CheckSquare size={13} />}
            action={
              <span className="text-[10px]" style={{ color: '#888' }}>
                {doneTasks}/{tasks.length} done
              </span>
            }
          />
          <div className="space-y-1 mb-3">
            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className="flex items-center gap-2.5 py-1.5 cursor-pointer"
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all"
                  style={{
                    background: t.done ? '#EA4C89' : 'transparent',
                    borderColor: t.done ? '#EA4C89' : '#F5C8E2',
                  }}
                >
                  {t.done && (
                    <span className="text-white text-[9px]">✓</span>
                  )}
                </div>
                <span
                  className={`text-xs transition-all ${
                    t.done ? 'line-through text-gray-300' : ''
                  }`}
                  style={{ color: t.done ? undefined : '#1A1A1A' }}
                >
                  {t.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a task..."
              className="flex-1 text-xs border rounded-xl px-2.5 py-1.5 focus:outline-none"
              style={{
                borderColor: '#F5C8E2',
                background: '#FFF7FB',
                fontFamily: 'Outfit,sans-serif',
              }}
            />
            <Button onClick={addTask} className="!px-2.5">
              <Plus size={13} />
            </Button>
          </div>
        </Card>

        {/* Habits */}
        <Card className="lg:col-span-1">
          <SectionHeader
            title="Habit tracker"
            icon={<Star size={13} />}
            action={
              <span className="text-[10px]" style={{ color: '#888' }}>
                This week
              </span>
            }
          />
          <div className="flex gap-1 mb-2">
            {DAYS.map((d, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[9px] font-medium"
                style={{ color: '#D8C1E8' }}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {habits.map((h) => (
              <div key={h.name}>
                <div
                  className="text-[11px] mb-1"
                  style={{ color: '#555' }}
                >
                  {h.name}
                </div>
                <div className="flex gap-1">
                  {h.days.map((d, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2.5 rounded-full"
                      style={{
                        background: d ? '#EA4C89' : '#FFEAF4',
                        border: '0.5px solid #F5C8E2',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div
              className="flex justify-between text-[10px] mb-1"
              style={{ color: '#888' }}
            >
              <span>Weekly progress</span>
              <span style={{ color: '#EA4C89' }}>74%</span>
            </div>
            <ProgressBar value={74} />
          </div>
        </Card>

        {/* Mood + Water */}
        <Card className="lg:col-span-1 flex flex-col gap-4">
          {/* Mood */}
          <div>
            <SectionHeader
              title="Mood check-in"
              icon={<Smile size={13} />}
            />
            <div className="flex gap-2 justify-center py-1">
              {MOODS.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  title={MOOD_LABELS[i]}
                  className="w-9 h-9 rounded-full text-xl flex items-center justify-center transition-all border"
                  style={{
                    borderColor: mood === i ? '#EA4C89' : '#F5C8E2',
                    background: mood === i ? '#FFEAF4' : 'transparent',
                    transform: mood === i ? 'scale(1.15)' : 'scale(1)',
                    opacity: mood === i ? 1 : 0.6,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            <p
              className="text-[10px] text-center mt-1"
              style={{ color: '#C73E74' }}
            >
              Feeling {MOOD_LABELS[mood].toLowerCase()} today 🌸
            </p>
          </div>

          {/* Water */}
          <div>
            <SectionHeader
              title="Water tracker"
              icon={<Droplets size={13} />}
              action={
                <span className="text-[10px]" style={{ color: '#888' }}>
                  Goal: 8 glasses
                </span>
              }
            />
            <div className="flex gap-1.5 justify-center">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setWater(i + 1)}
                  className="w-7 h-9 rounded-b-sm border transition-all"
                  style={{
                    borderColor: '#D8C1E8',
                    background: i < water ? '#D8C1E8' : '#FFEAF4',
                  }}
                />
              ))}
            </div>
            <p
              className="text-[10px] text-center mt-1"
              style={{ color: '#C73E74' }}
            >
              {water} / 8 glasses
            </p>
            <div className="mt-1">
              <ProgressBar value={water} max={8} color="lav" height={4} />
            </div>
          </div>
        </Card>

        {/* Calendar preview */}
        <Card className="lg:col-span-1">
          <SectionHeader
            title={today.toLocaleDateString('en-ZA', {
              month: 'long',
              year: 'numeric',
            })}
            icon={<Calendar size={13} />}
          />
          <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <div
                key={d}
                className="text-[9px] font-medium py-0.5"
                style={{ color: '#D8C1E8' }}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={'e' + i} />
            ))}
            {calDays.map((d) => (
              <div
                key={d}
                className="text-[10px] text-center py-1 rounded cursor-default"
                style={{
                  background: d === todayDate ? '#EA4C89' : 'transparent',
                  color:
                    d === todayDate
                      ? '#fff'
                      : eventDays.includes(d)
                      ? '#C73E74'
                      : '#aaa',
                  fontWeight:
                    d === todayDate || eventDays.includes(d) ? 600 : 400,
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </Card>

        {/* Finance snapshot */}
        <Card className="lg:col-span-1">
          <SectionHeader
            title="Finance snapshot"
            icon={<TrendingUp size={13} />}
          />
          {[
            { label: 'Income this month', value: '+ R24,800', pos: true },
            { label: 'Expenses', value: '− R8,200', pos: false },
            { label: 'Savings goal', value: 'R5,000 / R8,000', pos: null },
            { label: 'Subscriptions', value: '− R1,340', pos: false },
          ].map((r) => (
            <div
              key={r.label}
              className="flex justify-between items-center py-1.5 border-b last:border-0 text-xs"
              style={{ borderColor: '#FFEAF4' }}
            >
              <span style={{ color: '#555' }}>{r.label}</span>
              <span
                style={{
                  color:
                    r.pos === true
                      ? '#3B6D11'
                      : r.pos === false
                      ? '#A32D2D'
                      : '#1A1A1A',
                  fontWeight: 500,
                }}
              >
                {r.value}
              </span>
            </div>
          ))}
          <div className="mt-3">
            <div
              className="flex justify-between text-[10px] mb-1"
              style={{ color: '#888' }}
            >
              <span>Savings goal</span>
              <span style={{ color: '#EA4C89' }}>63%</span>
            </div>
            <ProgressBar value={63} />
          </div>
        </Card>

        {/* AI assistant */}
        <Card className="lg:col-span-1">
          <SectionHeader
            title="AI assistant"
            icon={<Sparkles size={13} />}
          />
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Ask me anything — plan my day, write a caption, business insight..."
            rows={3}
            className="w-full text-xs border rounded-xl px-3 py-2 resize-none focus:outline-none"
            style={{
              borderColor: '#F5C8E2',
              background: '#FFF7FB',
              fontFamily: 'Outfit,sans-serif',
              color: '#1A1A1A',
            }}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['Plan my day', 'Write caption', 'Business insight', 'Journal prompt'].map(
              (chip) => (
                <button
                  key={chip}
                  onClick={() => setAiInput(chip)}
                  className="text-[10px] px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:bg-[#EA4C89]/10"
                  style={{
                    borderColor: '#F5C8E2',
                    color: '#C73E74',
                    background: '#FBEAF0',
                  }}
                >
                  {chip}
                </button>
              )
            )}
          </div>
          <Button className="w-full mt-2 justify-center" onClick={() => setAiInput('')}>
            <Sparkles size={12} /> Ask Claude
          </Button>
        </Card>

      </div>
    </PageWrapper>
  )
}