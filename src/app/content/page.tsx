'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Plus, X, Lightbulb, FileText, TrendingUp } from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  SectionHeader,
  PageWrapper,
  Input,
  Select,
} from '@/components/ui'

type Post = {
  id: number
  platform: 'TikTok' | 'Instagram' | 'Both'
  type: string
  caption: string
  date: string
  status: 'idea' | 'draft' | 'ready' | 'posted'
  tags: string[]
}

const PLATFORMS = ['TikTok', 'Instagram', 'Both']
const TYPES = ['Reel', 'Carousel', 'Story', 'Static post', 'TikTok video', 'Live']

const STATUS_COLOR: Record<string, 'gray' | 'yellow' | 'lav' | 'green'> = {
  idea: 'gray',
  draft: 'yellow',
  ready: 'lav',
  posted: 'green',
}

const PLATFORM_BG: Record<string, string> = {
  TikTok: '#FBEAF0',
  Instagram: '#EEE8F5',
  Both: '#EAF3DE',
}

const PLATFORM_COLOR: Record<string, string> = {
  TikTok: '#EA4C89',
  Instagram: '#7B5EA7',
  Both: '#27500A',
}

export default function ContentPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      platform: 'TikTok',
      type: 'TikTok video',
      caption: 'Day in my life as a freelance web designer 🌸 Working from home, client calls, and aesthetic desk setup.',
      date: '2026-05-27',
      status: 'ready',
      tags: ['dayinmylife', 'webdesign', 'freelance'],
    },
    {
      id: 2,
      platform: 'Instagram',
      type: 'Carousel',
      caption: '5 tools every female entrepreneur needs in 2026 ✨ Save this for later!',
      date: '2026-05-28',
      status: 'draft',
      tags: ['entrepreneur', 'girlboss', 'tools'],
    },
    {
      id: 3,
      platform: 'Both',
      type: 'Reel',
      caption: 'How I went from R0 to R24k/month as a self-taught designer 💸',
      date: '2026-05-30',
      status: 'idea',
      tags: ['incomereveal', 'designer', 'motivation'],
    },
    {
      id: 4,
      platform: 'Instagram',
      type: 'Static post',
      caption: 'Your reminder that consistency beats perfection every single time 🌙',
      date: '2026-05-26',
      status: 'posted',
      tags: ['mindset', 'motivation'],
    },
    {
      id: 5,
      platform: 'TikTok',
      type: 'TikTok video',
      caption: 'Rating my clients from easiest to hardest to work with 😭',
      date: '2026-06-01',
      status: 'idea',
      tags: ['freelancelife', 'clients', 'storytime'],
    },
  ])

  const [ideas, setIdeas] = useState([
    'Morning routine as a CEO entrepreneur',
    'My dashboard setup tour',
    'Client red flags to watch out for',
    'How I price my web design packages',
    'Aesthetic home office setup tour',
    'Passive income streams as a designer',
  ])

  const [captions, setCaptions] = useState([
    {
      id: 1,
      title: 'Motivational Monday',
      text: 'She built her empire one decision at a time. Be her. 💫 #mondaymotivation #girlboss',
    },
    {
      id: 2,
      title: 'Income reveal hook',
      text: 'I made R24k last month from my laptop. Here is exactly how 👇 #incomereveal #freelance',
    },
    {
      id: 3,
      title: 'Soft life aesthetic',
      text: 'Building a life so beautiful I never need a vacation from it 🌸 #softlife #lifestyle',
    },
  ])

  const [activeTab, setActiveTab] = useState('calendar')
  const [showAdd, setShowAdd] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const [newPost, setNewPost] = useState<Omit<Post, 'id'>>({
    platform: 'Instagram',
    type: 'Reel',
    caption: '',
    date: '',
    status: 'idea',
    tags: [],
  })
  const [newIdea, setNewIdea] = useState('')
  const [newCapTitle, setNewCapTitle] = useState('')
  const [newCapText, setNewCapText] = useState('')
  const [tagInput, setTagInput] = useState('')

  const addPost = () => {
    if (!newPost.caption.trim()) return
    setPosts((ps) => [...ps, { ...newPost, id: Date.now() }])
    setNewPost({ platform: 'Instagram', type: 'Reel', caption: '', date: '', status: 'idea', tags: [] })
    setShowAdd(false)
  }

  const updateStatus = (id: number) => {
    const order: Post['status'][] = ['idea', 'draft', 'ready', 'posted']
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id
          ? { ...p, status: order[(order.indexOf(p.status) + 1) % order.length] }
          : p
      )
    )
  }

  const deletePost = (id: number) => setPosts((ps) => ps.filter((p) => p.id !== id))

  const addCaption = () => {
    if (!newCapTitle.trim() || !newCapText.trim()) return
    setCaptions((cs) => [...cs, { id: Date.now(), title: newCapTitle, text: newCapText }])
    setNewCapTitle('')
    setNewCapText('')
    setShowCaption(false)
  }

  const TABS = ['calendar', 'ideas', 'captions', 'analytics']

  return (
    <PageWrapper title="Content Planner" subtitle="Create content that converts and inspires 📱">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Posted this month', value: String(posts.filter((p) => p.status === 'posted').length) },
          { label: 'Ready to post', value: String(posts.filter((p) => p.status === 'ready').length) },
          { label: 'In draft', value: String(posts.filter((p) => p.status === 'draft').length) },
          { label: 'Content ideas', value: String(ideas.length) },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <div className="text-[11px] mb-1" style={{ color: '#C73E74' }}>{s.label}</div>
              <div className="text-xl font-semibold">{s.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4 border-b" style={{ borderColor: '#F5C8E2' }}>
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-4 py-2 text-xs capitalize border-b-2 transition-all -mb-px"
              style={{
                borderBottomColor: activeTab === t ? '#EA4C89' : 'transparent',
                color: activeTab === t ? '#EA4C89' : '#888',
                fontWeight: activeTab === t ? 500 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="pb-1">
          <Button onClick={() => setShowAdd((v) => !v)}>
            <Plus size={13} /> New post
          </Button>
        </div>
      </div>

      {/* Add post form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <Card style={{ borderColor: '#EA4C89', borderWidth: 1 }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium" style={{ color: '#C73E74' }}>New content piece</span>
                <button onClick={() => setShowAdd(false)}>
                  <X size={14} style={{ color: '#C73E74' }} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Select
                  label="Platform"
                  value={newPost.platform}
                  onChange={(v) => setNewPost((x) => ({ ...x, platform: v as Post['platform'] }))}
                  options={PLATFORMS.map((p) => ({ value: p, label: p }))}
                />
                <Select
                  label="Type"
                  value={newPost.type}
                  onChange={(v) => setNewPost((x) => ({ ...x, type: v }))}
                  options={TYPES.map((t) => ({ value: t, label: t }))}
                />
                <Select
                  label="Status"
                  value={newPost.status}
                  onChange={(v) => setNewPost((x) => ({ ...x, status: v as Post['status'] }))}
                  options={[
                    { value: 'idea', label: 'Idea' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'ready', label: 'Ready' },
                    { value: 'posted', label: 'Posted' },
                  ]}
                />
                <Input
                  label="Date"
                  value={newPost.date}
                  onChange={(v) => setNewPost((x) => ({ ...x, date: v }))}
                  type="date"
                />
                <div className="col-span-2">
                  <label className="text-[11px] font-medium mb-1 block" style={{ color: '#C73E74' }}>
                    Caption
                  </label>
                  <textarea
                    value={newPost.caption}
                    onChange={(e) => setNewPost((x) => ({ ...x, caption: e.target.value }))}
                    placeholder="Write your caption here..."
                    rows={3}
                    className="w-full border rounded-2xl px-3 py-2 text-xs resize-none focus:outline-none"
                    style={{ borderColor: '#F5C8E2', background: '#FFF7FB', fontFamily: 'Outfit,sans-serif' }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium mb-1 block" style={{ color: '#C73E74' }}>
                    Hashtags (press Enter to add)
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {newPost.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ background: '#FBEAF0', color: '#72243E' }}
                      >
                        #{t}
                        <button onClick={() => setNewPost((x) => ({ ...x, tags: x.tags.filter((tg) => tg !== t) }))}>
                          <X size={9} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        setNewPost((x) => ({ ...x, tags: [...x.tags, tagInput.trim()] }))
                        setTagInput('')
                      }
                    }}
                    placeholder="Add hashtag and press Enter..."
                    className="w-full border rounded-2xl px-3 py-1.5 text-xs focus:outline-none"
                    style={{ borderColor: '#F5C8E2', background: '#FFF7FB', fontFamily: 'Outfit,sans-serif' }}
                  />
                </div>
              </div>
              <Button onClick={addPost}>Save post</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-3">
          {posts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card hover className="group">
                <div className="flex items-start gap-3">
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ background: PLATFORM_COLOR[p.platform] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: PLATFORM_BG[p.platform], color: PLATFORM_COLOR[p.platform] }}
                      >
                        {p.platform}
                      </span>
                      <Badge color="gray">{p.type}</Badge>
                      <span className="text-[10px]" style={{ color: '#888' }}>
                        📅 {p.date || 'No date'}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: '#555', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {p.caption}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[10px]" style={{ color: '#D8C1E8' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button onClick={() => updateStatus(p.id)}>
                      <Badge color={STATUS_COLOR[p.status]}>{p.status}</Badge>
                    </button>
                    <button
                      onClick={() => deletePost(p.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} style={{ color: '#C73E74' }} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ideas tab */}
      {activeTab === 'ideas' && (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newIdea.trim()) {
                  setIdeas((is) => [...is, newIdea.trim()])
                  setNewIdea('')
                }
              }}
              placeholder="Type a content idea and press Enter..."
              className="flex-1 border rounded-2xl px-3 py-2 text-xs focus:outline-none"
              style={{ borderColor: '#F5C8E2', background: '#FFF7FB', fontFamily: 'Outfit,sans-serif' }}
            />
            <Button
              onClick={() => {
                if (newIdea.trim()) {
                  setIdeas((is) => [...is, newIdea.trim()])
                  setNewIdea('')
                }
              }}
            >
              <Plus size={13} /> Add
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ideas.map((idea, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card hover className="group">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#EA4C89' }} />
                    <p className="text-xs flex-1" style={{ color: '#555' }}>{idea}</p>
                    <button
                      onClick={() => setIdeas((is) => is.filter((_, j) => j !== i))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <X size={12} style={{ color: '#C73E74' }} />
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-3 w-full justify-center"
                    onClick={() => {
                      setNewPost((x) => ({ ...x, caption: idea }))
                      setShowAdd(true)
                      setActiveTab('calendar')
                    }}
                  >
                    Turn into post
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Captions tab */}
      {activeTab === 'captions' && (
        <div>
          <AnimatePresence>
            {showCaption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <Card>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium" style={{ color: '#C73E74' }}>Save caption</span>
                    <button onClick={() => setShowCaption(false)}>
                      <X size={14} style={{ color: '#C73E74' }} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Input label="Title" value={newCapTitle} onChange={setNewCapTitle} placeholder="e.g. Motivational Monday" />
                    <div>
                      <label className="text-[11px] font-medium mb-1 block" style={{ color: '#C73E74' }}>Caption text</label>
                      <textarea
                        value={newCapText}
                        onChange={(e) => setNewCapText(e.target.value)}
                        rows={4}
                        className="w-full border rounded-2xl px-3 py-2 text-xs resize-none focus:outline-none"
                        style={{ borderColor: '#F5C8E2', background: '#FFF7FB', fontFamily: 'Outfit,sans-serif' }}
                      />
                    </div>
                    <Button onClick={addCaption}>Save caption</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-end mb-3">
            <Button variant="ghost" onClick={() => setShowCaption((v) => !v)}>
              <Plus size={13} /> Save caption
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {captions.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover className="group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-medium" style={{ color: '#C73E74' }}>{c.title}</div>
                    <button
                      onClick={() => setCaptions((cs) => cs.filter((x) => x.id !== c.id))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} style={{ color: '#C73E74' }} />
                    </button>
                  </div>
                  <p className="text-xs mb-3" style={{ color: '#555' }}>{c.text}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(c.text)}
                    className="text-[10px] px-3 py-1 rounded-full border transition-all hover:bg-[#EA4C89]/10"
                    style={{ borderColor: '#F5C8E2', color: '#C73E74' }}
                  >
                    Copy caption
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <SectionHeader title="Posts by platform" icon={<Camera size={13} />} />
            {['TikTok', 'Instagram', 'Both'].map((p) => {
              const count = posts.filter((x) => x.platform === p).length
              return (
                <div key={p} className="mb-3">
                  <div className="flex justify-between text-[11px] mb-1" style={{ color: '#555' }}>
                    <span>{p}</span>
                    <span style={{ color: '#EA4C89' }}>{count} posts</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#FFEAF4' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${posts.length > 0 ? (count / posts.length) * 100 : 0}%` }}
                      transition={{ duration: 0.6 }}
                      style={{ background: PLATFORM_COLOR[p] }}
                    />
                  </div>
                </div>
              )
            })}
          </Card>
          <Card>
            <SectionHeader title="Posts by status" icon={<TrendingUp size={13} />} />
            {(['idea', 'draft', 'ready', 'posted'] as const).map((s) => {
              const count = posts.filter((x) => x.status === s).length
              return (
                <div
                  key={s}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                  style={{ borderColor: '#FFEAF4' }}
                >
                  <Badge color={STATUS_COLOR[s]}>{s}</Badge>
                  <span className="text-xs font-medium" style={{ color: '#1A1A1A' }}>
                    {count} posts
                  </span>
                </div>
              )
            })}
          </Card>
          <Card className="lg:col-span-2">
            <SectionHeader title="Upload checklist" icon={<FileText size={13} />} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'Write caption',
                'Add hashtags',
                'Design thumbnail',
                'Record or edit video',
                'Schedule post',
                'Add location',
                'Tag collaborators',
                'Add to calendar',
              ].map((item) => (
                <CheckItem key={item} label={item} />
              ))}
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  )
}

function CheckItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <div
      onClick={() => setChecked((v) => !v)}
      className="flex items-center gap-2 p-2.5 rounded-2xl cursor-pointer transition-all"
      style={{
        background: checked ? '#FBEAF0' : '#FFF7FB',
        border: `0.5px solid ${checked ? '#EA4C89' : '#F5C8E2'}`,
      }}
    >
      <div
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all"
        style={{
          background: checked ? '#EA4C89' : 'transparent',
          borderColor: checked ? '#EA4C89' : '#F5C8E2',
        }}
      >
        {checked && <span className="text-white text-[9px]">✓</span>}
      </div>
      <span className="text-[11px]" style={{ color: checked ? '#EA4C89' : '#555' }}>
        {label}
      </span>
    </div>
  )
}