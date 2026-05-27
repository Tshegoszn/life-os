'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, X, Smile } from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  SectionHeader,
  PageWrapper,
} from '@/components/ui'

type Entry = {
  id: number
  date: string
  mood: number
  title: string
  body: string
  gratitude: string[]
  tag: string
}

const MOODS = ['😩', '😔', '😐', '😊', '🤩']
const MOOD_LABELS = ['Awful', 'Low', 'Okay', 'Good', 'Amazing']

const PROMPTS = [
  'What are 3 things that went well today?',
  'What did you learn today?',
  'What are you looking forward to tomorrow?',
  'Describe your biggest win this week.',
  'What would make today perfect?',
  'Who made you smile today and why?',
  'What is something you want to let go of?',
  'Write about a goal you are excited about.',
]

const TAGS = ['Reflection', 'Win', 'Gratitude', 'Dream', 'Vent', 'Intention']

const TAG_COLOR: Record<string, 'pink' | 'green' | 'lav' | 'yellow' | 'red' | 'gray'> = {
  Reflection: 'lav',
  Win: 'green',
  Gratitude: 'pink',
  Dream: 'yellow',
  Vent: 'red',
  Intention: 'gray',
}

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 1,
      date: '2026-05-25',
      mood: 3,
      title: 'A productive Sunday',
      body: 'Today I managed to finally get ahead on client work. Sent two proposals and had a great brainstorm session for Ayasha brand campaign. Feeling focused and motivated.',
      gratitude: ['My morning coffee ritual', 'Lena kind feedback', 'Getting to bed early'],
      tag: 'Reflection',
    },
    {
      id: 2,
      date: '2026-05-23',
      mood: 4,
      title: 'Big win day!',
      body: 'Closed the Zara Mokoena web project. She loved the proposal and signed immediately. This is the biggest single project I have landed. My confidence is through the roof.',
      gratitude: ['Zara trust in my work', 'All the hours learning web design', 'My vision board keeping me focused'],
      tag: 'Win',
    },
    {
      id: 3,
      date: '2026-05-20',
      mood: 2,
      title: 'Feeling overwhelmed',
      body: 'Too many tasks and not enough structure today. I need to improve my morning routine and be stricter with my time blocks. Tomorrow is a new day.',
      gratitude: ['Having work to stress about', 'A warm bath tonight', 'My journal'],
      tag: 'Reflection',
    },
  ])

  const [showNew, setShowNew] = useState(false)
  const [viewEntry, setViewEntry] = useState<Entry | null>(null)
  const [prompt, setPrompt] = useState(PROMPTS[0])

  const [newEntry, setNewEntry] = useState<Omit<Entry, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    mood: 3,
    title: '',
    body: '',
    gratitude: ['', '', ''],
    tag: 'Reflection',
  })

  const saveEntry = () => {
    if (!newEntry.title.trim()) return
    setEntries((es) => [
      {
        ...newEntry,
        id: Date.now(),
        gratitude: newEntry.gratitude.filter(Boolean),
      },
      ...es,
    ])
    setNewEntry({
      date: new Date().toISOString().slice(0, 10),
      mood: 3,
      title: '',
      body: '',
      gratitude: ['', '', ''],
      tag: 'Reflection',
    })
    setShowNew(false)
  }

  const deleteEntry = (id: number) =>
    setEntries((es) => es.filter((e) => e.id !== id))

  const randomPrompt = () =>
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])

  return (
    <PageWrapper title="Journal" subtitle="Your private space to think, feel and grow 🌸">

      {/* Top bar */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-xs" style={{ color: '#888' }}>
          {entries.length} entries ·{' '}
          {new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
        </div>
        <Button
          onClick={() => {
            setShowNew(true)
            randomPrompt()
          }}
        >
          <Plus size={13} /> New entry
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left — entries list */}
        <div className="lg:col-span-2 space-y-3">

          {/* New entry form */}
          <AnimatePresence>
            {showNew && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card style={{ borderColor: '#EA4C89', borderWidth: 1 }}>
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#C73E74' }}
                    >
                      New entry ✨
                    </span>
                    <button onClick={() => setShowNew(false)}>
                      <X size={14} style={{ color: '#C73E74' }} />
                    </button>
                  </div>

                  {/* Prompt */}
                  <div
                    className="p-3 rounded-2xl mb-3 text-xs italic"
                    style={{ background: '#FFEAF4', color: '#C73E74', borderLeft: '3px solid #EA4C89' }}
                  >
                    💭 {prompt}
                  </div>

                  {/* Mood selector */}
                  <div className="flex gap-2 mb-3">
                    {MOODS.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => setNewEntry((e) => ({ ...e, mood: i }))}
                        className="w-9 h-9 rounded-full text-xl flex items-center justify-center border transition-all"
                        style={{
                          borderColor: newEntry.mood === i ? '#EA4C89' : '#F5C8E2',
                          background: newEntry.mood === i ? '#FFEAF4' : 'transparent',
                          transform: newEntry.mood === i ? 'scale(1.15)' : 'scale(1)',
                          opacity: newEntry.mood === i ? 1 : 0.5,
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Title */}
                  <input
                    value={newEntry.title}
                    onChange={(e) => setNewEntry((x) => ({ ...x, title: e.target.value }))}
                    placeholder="Entry title..."
                    className="w-full border-0 border-b text-sm font-medium focus:outline-none bg-transparent pb-2 mb-3"
                    style={{
                      borderColor: '#F5C8E2',
                      color: '#1A1A1A',
                      fontFamily: 'Playfair Display, serif',
                    }}
                  />

                  {/* Body */}
                  <textarea
                    value={newEntry.body}
                    onChange={(e) => setNewEntry((x) => ({ ...x, body: e.target.value }))}
                    placeholder="Write freely..."
                    rows={5}
                    className="w-full text-xs border rounded-2xl px-3 py-2 resize-none focus:outline-none mb-3"
                    style={{
                      borderColor: '#F5C8E2',
                      background: '#FFF7FB',
                      fontFamily: 'Outfit, sans-serif',
                      color: '#555',
                    }}
                  />

                  {/* Gratitude */}
                  <div className="mb-3">
                    <div
                      className="text-[11px] font-medium mb-2"
                      style={{ color: '#C73E74' }}
                    >
                      Gratitude — 3 things
                    </div>
                    {[0, 1, 2].map((i) => (
                      <input
                        key={i}
                        value={newEntry.gratitude[i] || ''}
                        onChange={(e) => {
                          const g = [...newEntry.gratitude]
                          g[i] = e.target.value
                          setNewEntry((x) => ({ ...x, gratitude: g }))
                        }}
                        placeholder="I am grateful for..."
                        className="w-full border-b text-xs focus:outline-none bg-transparent py-1.5 mb-1"
                        style={{
                          borderColor: '#F5C8E2',
                          color: '#555',
                          fontFamily: 'Outfit, sans-serif',
                        }}
                      />
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mb-3">
                    {TAGS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setNewEntry((x) => ({ ...x, tag: t }))}
                        className="text-[10px] px-2.5 py-1 rounded-full border transition-all"
                        style={{
                          background: newEntry.tag === t ? '#EA4C89' : '#FFEAF4',
                          color: newEntry.tag === t ? '#fff' : '#C73E74',
                          borderColor: newEntry.tag === t ? '#EA4C89' : '#F5C8E2',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <Button onClick={saveEntry}>Save entry 🌸</Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entry cards */}
          {entries.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                hover
                onClick={() => setViewEntry(viewEntry?.id === e.id ? null : e)}
                style={viewEntry?.id === e.id ? { borderColor: '#EA4C89', borderWidth: 1 } : {}}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-lg">{MOODS[e.mood]}</span>
                      <span className="text-[10px]" style={{ color: '#888' }}>
                        {e.date} · {MOOD_LABELS[e.mood]}
                      </span>
                      <Badge color={TAG_COLOR[e.tag] || 'lav'}>{e.tag}</Badge>
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ fontFamily: 'Playfair Display, serif', color: '#1A1A1A' }}
                    >
                      {e.title}
                    </div>
                  </div>
                  <button
                    onClick={(ev) => { ev.stopPropagation(); deleteEntry(e.id) }}
                    className="opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <X size={13} style={{ color: '#C73E74' }} />
                  </button>
                </div>

                <p
                  className="text-xs"
                  style={{
                    color: '#777',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {e.body}
                </p>

                {/* Expanded view */}
                <AnimatePresence>
                  {viewEntry?.id === e.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t"
                      style={{ borderColor: '#FFEAF4' }}
                      onClick={(ev) => ev.stopPropagation()}
                    >
                      <p className="text-xs mb-3" style={{ color: '#555' }}>
                        {e.body}
                      </p>
                      {e.gratitude.length > 0 && (
                        <div
                          className="p-3 rounded-2xl"
                          style={{ background: '#FFEAF4' }}
                        >
                          <div
                            className="text-[11px] font-medium mb-1"
                            style={{ color: '#C73E74' }}
                          >
                            Grateful for
                          </div>
                          {e.gratitude.map((g, gi) => (
                            <div
                              key={gi}
                              className="text-xs flex items-center gap-1.5 py-0.5"
                              style={{ color: '#555' }}
                            >
                              <span style={{ color: '#EA4C89' }}>🌸</span> {g}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Right panel */}
        <div className="space-y-4">

          {/* Mood history */}
          <Card>
            <SectionHeader title="Mood history" icon={<Smile size={13} />} />
            <div className="space-y-2">
              {entries.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                  <span className="text-sm">{MOODS[e.mood]}</span>
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: '#FFEAF4' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(e.mood + 1) * 20}%` }}
                      transition={{ duration: 0.6 }}
                      style={{ background: '#EA4C89' }}
                    />
                  </div>
                  <span className="text-[10px]" style={{ color: '#888' }}>
                    {e.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily prompt */}
          <Card>
            <SectionHeader
              title="Today's prompt"
              icon={<BookOpen size={13} />}
              action={
                <button
                  onClick={randomPrompt}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: '#FFEAF4', color: '#C73E74' }}
                >
                  New ↺
                </button>
              }
            />
            <p className="text-xs italic" style={{ color: '#555' }}>
              {prompt}
            </p>
            <Button
              className="mt-3 w-full justify-center"
              onClick={() => {
                setShowNew(true)
                randomPrompt()
              }}
            >
              Start writing
            </Button>
          </Card>

          {/* Stats */}
          <Card>
            <SectionHeader title="Journal stats" icon={<BookOpen size={13} />} />
            {[
              { label: 'Total entries', value: String(entries.length) },
              {
                label: 'This month',
                value: String(
                  entries.filter((e) => e.date.startsWith('2026-05')).length
                ),
              },
              {
                label: 'Avg mood',
                value:
                  MOODS[
                    Math.round(
                      entries.reduce((a, b) => a + b.mood, 0) / entries.length
                    )
                  ],
              },
              {
                label: 'Most used tag',
                value: (() => {
                  const counts: Record<string, number> = {}
                  entries.forEach((e) => {
                    counts[e.tag] = (counts[e.tag] || 0) + 1
                  })
                  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
                })(),
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex justify-between py-1.5 border-b last:border-0 text-xs"
                style={{ borderColor: '#FFEAF4' }}
              >
                <span style={{ color: '#888' }}>{s.label}</span>
                <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{s.value}</span>
              </div>
            ))}
          </Card>

        </div>
      </div>
    </PageWrapper>
  )
}
