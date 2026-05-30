'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Droplets, Moon, Sun, Plus, Sparkles, Loader } from 'lucide-react'
import { Card, Button, ProgressBar, SectionHeader, PageWrapper, Input } from '@/components/ui'
import { supabase } from '@/lib/supabase'

type SkinStep = { id: number; text: string; done: boolean; am: boolean }
type WellnessItem = { id: number; text: string; done: boolean }
type SleepEntry = { id: string; date: string; sleep_hours: number; sleep_quality: number }

export default function SelfCarePage() {
  const [skincare, setSkincare] = useState<SkinStep[]>([
    { id: 1, text: 'Gentle cleanser', done: false, am: true },
    { id: 2, text: 'Vitamin C serum', done: false, am: true },
    { id: 3, text: 'Moisturiser SPF 50', done: false, am: true },
    { id: 4, text: 'Lip balm', done: false, am: true },
    { id: 5, text: 'Oil cleanser', done: false, am: false },
    { id: 6, text: 'Exfoliant (2x week)', done: false, am: false },
    { id: 7, text: 'Retinol serum', done: false, am: false },
    { id: 8, text: 'Night moisturiser', done: false, am: false },
  ])

  const [wellness, setWellness] = useState<WellnessItem[]>([
    { id: 1, text: 'Morning stretch or yoga', done: false },
    { id: 2, text: 'Drink 2L water', done: false },
    { id: 3, text: 'Healthy breakfast', done: false },
    { id: 4, text: 'Go outside for fresh air', done: false },
    { id: 5, text: 'No phone 1 hour before bed', done: false },
    { id: 6, text: 'Gratitude journal', done: false },
    { id: 7, text: 'Take vitamins', done: false },
    { id: 8, text: 'Evening meditation', done: false },
  ])

  const [sleepLogs, setSleepLogs] = useState<SleepEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [water, setWater] = useState(0)
  const [showAddSleep, setShowAddSleep] = useState(false)
  const [showAddWellness, setShowAddWellness] = useState(false)
  const [newSleep, setNewSleep] = useState({ date: '', hours: '', quality: '3' })
  const [newWellness, setNewWellness] = useState('')
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    loadTodayLog()
    loadSleepHistory()
  }, [])

  const loadTodayLog = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('selfcare_logs')
      .select('*')
      .eq('date', today)
      .single()
    if (data) {
      setWater(data.water || 0)
      // restore skincare done states
      if (data.skincare_am !== undefined) {
        setSkincare((sk) => sk.map((s, i) => s.am ? { ...s, done: !!(data.skincare_am & (1 << i)) } : { ...s, done: !!(data.skincare_pm & (1 << (i - 4))) }))
      }
      if (data.wellness_score !== undefined) {
        setWellness((ws) => ws.map((w, i) => ({ ...w, done: !!(data.wellness_score & (1 << i)) })))
      }
    }
    setLoading(false)
  }

  const loadSleepHistory = async () => {
    const { data } = await supabase
      .from('selfcare_logs')
      .select('id, date, sleep_hours, sleep_quality')
      .gt('sleep_hours', 0)
      .order('date', { ascending: false })
      .limit(7)
    if (data) setSleepLogs(data)
  }

  const saveLog = async (updates: Record<string, number>) => {
    setSaving(true)
    const amDoneBits = skincare.filter((s) => s.am).reduce((bits, s, i) => bits | (s.done ? 1 << i : 0), 0)
    const pmDoneBits = skincare.filter((s) => !s.am).reduce((bits, s, i) => bits | (s.done ? 1 << i : 0), 0)
    const wellnessBits = wellness.reduce((bits, w, i) => bits | (w.done ? 1 << i : 0), 0)
    const payload = {
      date: today,
      water,
      skincare_am: amDoneBits,
      skincare_pm: pmDoneBits,
      wellness_score: wellnessBits,
      ...updates,
    }
    await supabase.from('selfcare_logs').upsert(payload, { onConflict: 'date' })
    setSaving(false)
  }

  const toggleSkincare = async (id: number) => {
    const updated = skincare.map((s) => s.id === id ? { ...s, done: !s.done } : s)
    setSkincare(updated)
    await saveLog({})
  }

  const toggleWellness = async (id: number) => {
    const updated = wellness.map((w) => w.id === id ? { ...w, done: !w.done } : w)
    setWellness(updated)
    await saveLog({})
  }

  const updateWater = async (val: number) => {
    setWater(val)
    await saveLog({ water: val })
  }

  const addSleepEntry = async () => {
    if (!newSleep.date || !newSleep.hours) return
    const payload = {
      date: newSleep.date,
      sleep_hours: Number(newSleep.hours),
      sleep_quality: Number(newSleep.quality),
      water: 0, skincare_am: 0, skincare_pm: 0, wellness_score: 0,
    }
    const { data } = await supabase
      .from('selfcare_logs')
      .upsert(payload, { onConflict: 'date' })
      .select()
    if (data) setSleepLogs((sl) => [data[0], ...sl.filter((s) => s.date !== newSleep.date)])
    setNewSleep({ date: '', hours: '', quality: '3' })
    setShowAddSleep(false)
  }

  const addWellnessItem = () => {
    if (!newWellness.trim()) return
    setWellness((w) => [...w, { id: Date.now(), text: newWellness.trim(), done: false }])
    setNewWellness('')
    setShowAddWellness(false)
  }

  const amDone = skincare.filter((s) => s.am && s.done).length
  const amTotal = skincare.filter((s) => s.am).length
  const pmDone = skincare.filter((s) => !s.am && s.done).length
  const pmTotal = skincare.filter((s) => !s.am).length
  const wellnessDone = wellness.filter((w) => w.done).length
  const avgSleep = sleepLogs.length > 0 ? sleepLogs.reduce((a, b) => a + b.sleep_hours, 0) / sleepLogs.length : 0
  const avgQuality = sleepLogs.length > 0 ? sleepLogs.reduce((a, b) => a + b.sleep_quality, 0) / sleepLogs.length : 0
  const QUALITY_EMOJI = ['', '😩', '😔', '😐', '😊', '🤩']

  if (loading) return (
    <PageWrapper title="Self-Care Hub" subtitle="You cannot pour from an empty cup 🌸">
      <div className="flex items-center justify-center h-64">
        <Loader size={24} className="animate-spin" style={{ color: '#EA4C89' }} />
      </div>
    </PageWrapper>
  )

  return (
    <PageWrapper title="Self-Care Hub" subtitle="You cannot pour from an empty cup 🌸">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Wellness score', value: `${Math.round((wellnessDone / wellness.length) * 100)}%`, sub: `${wellnessDone}/${wellness.length} done today` },
          { label: 'Skincare today', value: `${amDone + pmDone}/${amTotal + pmTotal}`, sub: 'AM + PM steps' },
          { label: 'Avg sleep', value: avgSleep > 0 ? `${avgSleep.toFixed(1)}h` : '—', sub: 'Last 7 nights' },
          { label: 'Hydration', value: `${water}/8`, sub: 'Glasses today' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="text-[11px] mb-1" style={{ color: '#C73E74' }}>{s.label}</div>
              <div className="text-xl font-semibold">{s.value}</div>
              <div className="text-[10px] mt-1 text-gray-400">{s.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {saving && (
        <div className="mb-3 text-[10px] flex items-center gap-1" style={{ color: '#EA4C89' }}>
          <Loader size={10} className="animate-spin" /> Saving...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* AM Skincare */}
        <Card>
          <SectionHeader title="AM skincare routine" icon={<Sun size={13} />}
            action={<span className="text-[10px]" style={{ color: '#888' }}>{amDone}/{amTotal}</span>} />
          <div className="space-y-1.5 mb-3">
            {skincare.filter((s) => s.am).map((s) => (
              <div key={s.id} onClick={() => toggleSkincare(s.id)} className="flex items-center gap-2.5 py-1 cursor-pointer">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border transition-all text-[10px]"
                  style={{ background: s.done ? '#EA4C89' : 'transparent', borderColor: s.done ? '#EA4C89' : '#F5C8E2', color: '#fff' }}>
                  {s.done && '✓'}
                </div>
                <span className={`text-xs ${s.done ? 'line-through text-gray-300' : ''}`} style={{ color: s.done ? undefined : '#555' }}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
          <ProgressBar value={amDone} max={amTotal} />
        </Card>

        {/* PM Skincare */}
        <Card>
          <SectionHeader title="PM skincare routine" icon={<Moon size={13} />}
            action={<span className="text-[10px]" style={{ color: '#888' }}>{pmDone}/{pmTotal}</span>} />
          <div className="space-y-1.5 mb-3">
            {skincare.filter((s) => !s.am).map((s) => (
              <div key={s.id} onClick={() => toggleSkincare(s.id)} className="flex items-center gap-2.5 py-1 cursor-pointer">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border transition-all text-[10px]"
                  style={{ background: s.done ? '#D8C1E8' : 'transparent', borderColor: s.done ? '#D8C1E8' : '#F5C8E2', color: '#fff' }}>
                  {s.done && '✓'}
                </div>
                <span className={`text-xs ${s.done ? 'line-through text-gray-300' : ''}`} style={{ color: s.done ? undefined : '#555' }}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
          <ProgressBar value={pmDone} max={pmTotal} color="lav" />
        </Card>

        {/* Hydration */}
        <Card>
          <SectionHeader title="Hydration tracker" icon={<Droplets size={13} />}
            action={<span className="text-[10px]" style={{ color: '#888' }}>Goal: 8 glasses</span>} />
          <div className="grid grid-cols-4 gap-2 my-3">
            {Array.from({ length: 8 }, (_, i) => (
              <button key={i} onClick={() => updateWater(i + 1)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                style={{ background: i < water ? '#EEE8F5' : '#FFF7FB', border: `0.5px solid ${i < water ? '#D8C1E8' : '#F5C8E2'}` }}>
                <Droplets size={16} style={{ color: i < water ? '#D8C1E8' : '#F5C8E2' }} />
                <span className="text-[9px]" style={{ color: i < water ? '#7B5EA7' : '#ccc' }}>{i + 1}</span>
              </button>
            ))}
          </div>
          <div className="text-center text-xs mb-2" style={{ color: '#C73E74' }}>{water} / 8 glasses 💧</div>
          <ProgressBar value={water} max={8} color="lav" height={5} />
          <div className="mt-4 p-3 rounded-2xl text-xs" style={{ background: '#FFEAF4', color: '#C73E74' }}>
            <div className="font-medium mb-1 flex items-center gap-1"><Sparkles size={11} /> Hydration tip</div>
            <p style={{ color: '#555' }}>
              {water < 4 ? 'You need to drink more water! Try setting hourly reminders 💧'
                : water < 7 ? 'You are doing great! Just a few more glasses to go 🌸'
                : 'Amazing! You have hit your hydration goal today 🎉'}
            </p>
          </div>
        </Card>

        {/* Wellness checklist */}
        <Card className="lg:col-span-2">
          <SectionHeader title="Daily wellness checklist" icon={<Heart size={13} />}
            action={<Button variant="ghost" onClick={() => setShowAddWellness((v) => !v)}><Plus size={12} /></Button>} />
          <AnimatePresence>
            {showAddWellness && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
                <div className="flex gap-2">
                  <input value={newWellness} onChange={(e) => setNewWellness(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addWellnessItem()}
                    placeholder="Add wellness habit..."
                    className="flex-1 border rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                    style={{ borderColor: '#F5C8E2', background: '#FFF7FB', fontFamily: 'Outfit,sans-serif' }} />
                  <Button onClick={addWellnessItem}>Add</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-3">
            {wellness.map((w) => (
              <div key={w.id} onClick={() => toggleWellness(w.id)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl cursor-pointer transition-all"
                style={{ background: w.done ? '#FBEAF0' : 'transparent' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border transition-all text-[10px]"
                  style={{ background: w.done ? '#EA4C89' : 'transparent', borderColor: w.done ? '#EA4C89' : '#F5C8E2', color: '#fff' }}>
                  {w.done && '✓'}
                </div>
                <span className={`text-xs flex-1 ${w.done ? 'line-through text-gray-300' : ''}`} style={{ color: w.done ? undefined : '#555' }}>
                  {w.text}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1" style={{ color: '#888' }}>
              <span>Daily wellness score</span>
              <span style={{ color: '#EA4C89' }}>{Math.round((wellnessDone / wellness.length) * 100)}%</span>
            </div>
            <ProgressBar value={wellnessDone} max={wellness.length} />
          </div>
        </Card>

        {/* Sleep tracker */}
        <Card>
          <SectionHeader title="Sleep tracker" icon={<Moon size={13} />}
            action={<Button variant="ghost" onClick={() => setShowAddSleep((v) => !v)}><Plus size={12} /></Button>} />
          <AnimatePresence>
            {showAddSleep && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
                <div className="p-3 rounded-2xl space-y-2" style={{ background: '#FFF7FB', border: '0.5px solid #F5C8E2' }}>
                  <Input label="Date" value={newSleep.date} onChange={(v) => setNewSleep((x) => ({ ...x, date: v }))} type="date" />
                  <Input label="Hours slept" value={newSleep.hours} onChange={(v) => setNewSleep((x) => ({ ...x, hours: v }))} type="number" placeholder="7.5" />
                  <div>
                    <label className="text-[11px] font-medium mb-1 block" style={{ color: '#C73E74' }}>Sleep quality</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((q) => (
                        <button key={q} onClick={() => setNewSleep((x) => ({ ...x, quality: String(q) }))}
                          className="w-8 h-8 rounded-full text-sm border transition-all"
                          style={{ borderColor: newSleep.quality === String(q) ? '#EA4C89' : '#F5C8E2', background: newSleep.quality === String(q) ? '#FBEAF0' : 'transparent' }}>
                          {QUALITY_EMOJI[q]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addSleepEntry}>Save</Button>
                    <Button variant="ghost" onClick={() => setShowAddSleep(false)}>Cancel</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sleep summary */}
          <div className="flex gap-3 mb-3 p-3 rounded-2xl" style={{ background: '#FFEAF4' }}>
            <div className="text-center flex-1">
              <div className="text-lg font-semibold" style={{ color: '#EA4C89' }}>{avgSleep > 0 ? `${avgSleep.toFixed(1)}h` : '—'}</div>
              <div className="text-[10px]" style={{ color: '#888' }}>Avg sleep</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-lg font-semibold" style={{ color: '#D8C1E8' }}>{avgQuality > 0 ? QUALITY_EMOJI[Math.round(avgQuality)] : '—'}</div>
              <div className="text-[10px]" style={{ color: '#888' }}>Avg quality</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-lg font-semibold" style={{ color: '#C73E74' }}>
                {sleepLogs.filter((s) => s.sleep_hours >= 7).length}/{sleepLogs.length}
              </div>
              <div className="text-[10px]" style={{ color: '#888' }}>Good nights</div>
            </div>
          </div>

          {/* Sleep log */}
          {sleepLogs.length === 0 ? (
            <div className="text-center py-4 text-xs" style={{ color: '#D8C1E8' }}>No sleep logs yet — add one above 🌙</div>
          ) : (
            <div className="space-y-2">
              {sleepLogs.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-1.5 border-b last:border-0" style={{ borderColor: '#FFEAF4' }}>
                  <div className="text-[10px] flex-shrink-0" style={{ color: '#888' }}>{s.date?.slice(5)}</div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#FFEAF4' }}>
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: `${(s.sleep_hours / 10) * 100}%` }} transition={{ duration: 0.6 }}
                      style={{ background: s.sleep_hours >= 7 ? '#D8C1E8' : s.sleep_hours >= 6 ? '#F5C8E2' : '#FBEAF0' }} />
                  </div>
                  <div className="text-xs font-medium flex-shrink-0" style={{ color: '#C73E74' }}>{s.sleep_hours}h</div>
                  <div className="text-sm flex-shrink-0">{QUALITY_EMOJI[s.sleep_quality]}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </PageWrapper>
  )
}