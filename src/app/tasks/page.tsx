'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Plus, X } from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  SectionHeader,
  PageWrapper,
  Input,
  Select,
} from '@/components/ui'

type Priority = 'high' | 'medium' | 'low'
type Status = 'todo' | 'inprogress' | 'done'
type Task = {
  id: number
  text: string
  priority: Priority
  due: string
  tag: string
  status: Status
}

const PRIORITY_COLOR: Record<Priority, 'red' | 'yellow' | 'green'> = {
  high: 'red',
  medium: 'yellow',
  low: 'green',
}

const TAGS = ['Business', 'Content', 'Personal', 'Finance', 'Design', 'Admin']

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#F5C8E2' },
  { id: 'inprogress', label: 'In Progress', color: '#D8C1E8' },
  { id: 'done', label: 'Done ✓', color: '#B5D5A0' },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Send Lena brand proposal', priority: 'high', due: '2026-05-27', tag: 'Business', status: 'todo' },
    { id: 2, text: 'Write 5 TikTok caption drafts', priority: 'medium', due: '2026-05-28', tag: 'Content', status: 'todo' },
    { id: 3, text: 'Update Life OS dashboard UI', priority: 'high', due: '2026-06-01', tag: 'Design', status: 'inprogress' },
    { id: 4, text: 'Review Supabase schema', priority: 'medium', due: '2026-05-30', tag: 'Business', status: 'inprogress' },
    { id: 5, text: 'Post Monday reel', priority: 'low', due: '2026-05-26', tag: 'Content', status: 'done' },
    { id: 6, text: 'Send invoice INV-041', priority: 'high', due: '2026-05-25', tag: 'Finance', status: 'done' },
    { id: 7, text: 'Reply to client emails', priority: 'medium', due: '2026-05-27', tag: 'Admin', status: 'todo' },
    { id: 8, text: 'Plan June content calendar', priority: 'low', due: '2026-06-01', tag: 'Content', status: 'todo' },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({
    text: '',
    priority: 'medium' as Priority,
    due: '',
    tag: 'Business',
    status: 'todo' as Status,
  })
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'kanban' | 'list'>('kanban')

  const addTask = () => {
    if (!newTask.text.trim()) return
    setTasks((ts) => [...ts, { id: Date.now(), ...newTask }])
    setNewTask({ text: '', priority: 'medium', due: '', tag: 'Business', status: 'todo' })
    setShowAdd(false)
  }

  const moveTask = (id: number, status: Status) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)))

  const deleteTask = (id: number) =>
    setTasks((ts) => ts.filter((t) => t.id !== id))

  const filtered =
    filter === 'all'
      ? tasks
      : tasks.filter((t) => t.tag === filter || t.priority === filter)

  const colTasks = (col: Status) => filtered.filter((t) => t.status === col)

  return (
    <PageWrapper title="Task Manager" subtitle="Focus on what matters most ✨">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total tasks', value: String(tasks.length) },
          { label: 'To do', value: String(tasks.filter((t) => t.status === 'todo').length) },
          { label: 'In progress', value: String(tasks.filter((t) => t.status === 'inprogress').length) },
          { label: 'Done', value: String(tasks.filter((t) => t.status === 'done').length) },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <div className="text-[11px] mb-1" style={{ color: '#C73E74' }}>
                {s.label}
              </div>
              <div className="text-xl font-semibold">{s.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...TAGS].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-[10px] px-2.5 py-1 rounded-full border capitalize transition-all"
              style={{
                background: filter === f ? '#EA4C89' : '#FFEAF4',
                color: filter === f ? '#fff' : '#C73E74',
                borderColor: filter === f ? '#EA4C89' : '#F5C8E2',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setView((v) => (v === 'kanban' ? 'list' : 'kanban'))}
          >
            {view === 'kanban' ? '☰ List' : '⊞ Kanban'}
          </Button>
          <Button onClick={() => setShowAdd((v) => !v)}>
            <Plus size={13} /> New task
          </Button>
        </div>
      </div>

      {/* Add task form */}
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
                  New task
                </span>
                <button onClick={() => setShowAdd(false)}>
                  <X size={14} style={{ color: '#C73E74' }} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="col-span-2">
                  <Input
                    label="Task"
                    value={newTask.text}
                    onChange={(v) => setNewTask((x) => ({ ...x, text: v }))}
                    placeholder="What needs to get done?"
                  />
                </div>
                <Select
                  label="Priority"
                  value={newTask.priority}
                  onChange={(v) => setNewTask((x) => ({ ...x, priority: v as Priority }))}
                  options={[
                    { value: 'high', label: '🔴 High' },
                    { value: 'medium', label: '🟡 Medium' },
                    { value: 'low', label: '🟢 Low' },
                  ]}
                />
                <Select
                  label="Tag"
                  value={newTask.tag}
                  onChange={(v) => setNewTask((x) => ({ ...x, tag: v }))}
                  options={TAGS.map((t) => ({ value: t, label: t }))}
                />
                <Input
                  label="Due date"
                  value={newTask.due}
                  onChange={(v) => setNewTask((x) => ({ ...x, due: v }))}
                  type="date"
                />
                <Select
                  label="Column"
                  value={newTask.status}
                  onChange={(v) => setNewTask((x) => ({ ...x, status: v as Status }))}
                  options={[
                    { value: 'todo', label: 'To Do' },
                    { value: 'inprogress', label: 'In Progress' },
                    { value: 'done', label: 'Done' },
                  ]}
                />
              </div>
              <Button onClick={addTask}>Add task</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban view */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.id}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: col.color }}
                />
                <span className="text-xs font-medium" style={{ color: '#C73E74' }}>
                  {col.label}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: '#FFEAF4', color: '#888' }}
                >
                  {colTasks(col.id).length}
                </span>
              </div>
              <div className="space-y-2 min-h-32">
                <AnimatePresence>
                  {colTasks(col.id).map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card hover className="group">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className="text-xs font-medium leading-relaxed"
                            style={{ color: '#1A1A1A' }}
                          >
                            {t.text}
                          </span>
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <X size={12} style={{ color: '#C73E74' }} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge color={PRIORITY_COLOR[t.priority]}>{t.priority}</Badge>
                          <Badge color="lav">{t.tag}</Badge>
                          {t.due && (
                            <span className="text-[10px]" style={{ color: '#888' }}>
                              📅 {t.due.slice(5)}
                            </span>
                          )}
                        </div>
                        {/* Move buttons */}
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                            <button
                              key={c.id}
                              onClick={() => moveTask(t.id, c.id)}
                              className="text-[9px] px-2 py-0.5 rounded-full border transition-all hover:bg-[#EA4C89]/10"
                              style={{ borderColor: '#F5C8E2', color: '#888' }}
                            >
                              → {c.label.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {colTasks(col.id).length === 0 && (
                  <div
                    className="text-[11px] text-center py-8 rounded-2xl"
                    style={{ color: '#D8C1E8', border: '1px dashed #F5C8E2' }}
                  >
                    No tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <Card>
          <div className="space-y-1.5">
            {filtered.map((t) => (
              <motion.div
                key={t.id}
                layout
                className="flex items-center gap-3 py-2 px-3 rounded-2xl group cursor-pointer hover:bg-[#FFEAF4] transition-all"
                onClick={() =>
                  moveTask(
                    t.id,
                    t.status === 'done'
                      ? 'todo'
                      : t.status === 'todo'
                      ? 'inprogress'
                      : 'done'
                  )
                }
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all"
                  style={{
                    background: t.status === 'done' ? '#EA4C89' : 'transparent',
                    borderColor: t.status === 'done' ? '#EA4C89' : '#F5C8E2',
                  }}
                >
                  {t.status === 'done' && (
                    <span className="text-white text-[9px]">✓</span>
                  )}
                </div>
                <span
                  className={`text-xs flex-1 ${
                    t.status === 'done' ? 'line-through text-gray-300' : ''
                  }`}
                  style={{ color: t.status === 'done' ? undefined : '#1A1A1A' }}
                >
                  {t.text}
                </span>
                <Badge color={PRIORITY_COLOR[t.priority]}>{t.priority}</Badge>
                <Badge color="lav">{t.tag}</Badge>
                {t.due && (
                  <span className="text-[10px]" style={{ color: '#888' }}>
                    {t.due.slice(5)}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteTask(t.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} style={{ color: '#C73E74' }} />
                </button>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </PageWrapper>
  )
}