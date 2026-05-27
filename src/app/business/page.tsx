'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Plus,
  X,
  Filter,
  BarChart3,
} from 'lucide-react'
import {
  Card,
  Button,
  Badge,
  ProgressBar,
  StatCard,
  SectionHeader,
  PageWrapper,
  Input,
  Select,
} from '@/components/ui'

const revData = [
  { month: 'Dec', rev: 14200 },
  { month: 'Jan', rev: 18500 },
  { month: 'Feb', rev: 16800 },
  { month: 'Mar', rev: 21000 },
  { month: 'Apr', rev: 19500 },
  { month: 'May', rev: 24800 },
]

const SERVICES = [
  'Brand identity',
  'Web design',
  'Social media',
  'Copywriting',
  'Full package',
]

const STAGE_ORDER = ['new', 'contacted', 'proposal', 'won']
const STAGE_LABELS: Record<string, string> = {
  new: 'New lead',
  contacted: 'Contacted',
  proposal: 'Proposal sent',
  won: 'Won ✓',
}
const STAGE_COLOR: Record<string, 'pink' | 'yellow' | 'lav' | 'green'> = {
  new: 'pink',
  contacted: 'yellow',
  proposal: 'lav',
  won: 'green',
}

type Client = {
  id: number
  name: string
  biz: string
  service: string
  value: number
  status: string
  notes: string
}
type Project = {
  id: number
  name: string
  client: string
  pct: number
  due: string
  value: number
}
type Invoice = {
  id: string
  client: string
  amount: number
  due: string
  status: string
}
type Lead = {
  id: number
  name: string
  src: string
  value: number
  stage: string
}

export default function BusinessPage() {
  const [tab, setTab] = useState('overview')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddLead, setShowAddLead] = useState(false)

  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Lena Dlamini', biz: 'Fashion brand', service: 'Brand identity', value: 4500, status: 'active', notes: 'Loves clean minimal aesthetic. Prefers WhatsApp comms.' },
    { id: 2, name: 'Zara Mokoena', biz: 'Life coach', service: 'Web design', value: 6000, status: 'active', notes: 'Monthly retainer. Next call Mon 3pm.' },
    { id: 3, name: 'Thabo Nkosi', biz: 'Fitness studio', service: 'Social media', value: 3200, status: 'pending', notes: 'Awaiting contract sign-off.' },
    { id: 4, name: 'Ayasha Pillay', biz: 'Skincare brand', service: 'Full package', value: 8500, status: 'active', notes: 'Flagship client. Quarterly review due June.' },
    { id: 5, name: 'Kefilwe Sithole', biz: 'Photography', service: 'Copywriting', value: 2000, status: 'done', notes: 'Project completed April 2026.' },
    { id: 6, name: 'Naledi Tau', biz: 'Online boutique', service: 'Web design', value: 5500, status: 'overdue', notes: 'Invoice overdue. Follow up urgently.' },
  ])

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Brand refresh', client: 'Lena Dlamini', pct: 72, due: '2026-06-10', value: 4500 },
    { id: 2, name: 'Portfolio website', client: 'Zara Mokoena', pct: 45, due: '2026-06-25', value: 6000 },
    { id: 3, name: 'Product shoot copy', client: 'Ayasha Pillay', pct: 90, due: '2026-05-30', value: 2200 },
  ])

  const [invoices] = useState<Invoice[]>([
    { id: 'INV-041', client: 'Zara Mokoena', amount: 6000, due: '2026-05-28', status: 'overdue' },
    { id: 'INV-042', client: 'Naledi Tau', amount: 5500, due: '2026-05-25', status: 'overdue' },
    { id: 'INV-043', client: 'Lena Dlamini', amount: 4500, due: '2026-06-10', status: 'pending' },
    { id: 'INV-044', client: 'Ayasha Pillay', amount: 8500, due: '2026-06-15', status: 'pending' },
    { id: 'INV-045', client: 'Thabo Nkosi', amount: 3200, due: '2026-06-20', status: 'draft' },
  ])

  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, name: 'Simone Jacobs', src: 'TikTok', value: 5000, stage: 'proposal' },
    { id: 2, name: 'Mpho Dube', src: 'Referral', value: 3500, stage: 'contacted' },
    { id: 3, name: 'Yolanda Khumalo', src: 'Instagram', value: 7200, stage: 'new' },
    { id: 4, name: 'Refiloe Mthembu', src: 'LinkedIn', value: 4800, stage: 'won' },
  ])

  const [nc, setNc] = useState({ name: '', biz: '', service: 'Brand identity', value: '' })
  const [np, setNp] = useState({ name: '', client: '', value: '', due: '' })
  const [nl, setNl] = useState({ name: '', src: '', value: '' })

  const statusColor: Record<string, 'green' | 'yellow' | 'gray' | 'red'> = {
    active: 'green',
    pending: 'yellow',
    done: 'gray',
    overdue: 'red',
  }
  const invColor: Record<string, 'red' | 'yellow' | 'gray' | 'green'> = {
    overdue: 'red',
    pending: 'yellow',
    draft: 'gray',
    paid: 'green',
  }

  const addClient = () => {
    if (!nc.name.trim()) return
    setClients((c) => [
      ...c,
      { id: Date.now(), name: nc.name, biz: nc.biz, service: nc.service, value: Number(nc.value) || 0, status: 'pending', notes: '' },
    ])
    setNc({ name: '', biz: '', service: 'Brand identity', value: '' })
    setShowAddClient(false)
    setTab('clients')
  }

  const addProject = () => {
    if (!np.name.trim()) return
    setProjects((p) => [
      ...p,
      { id: Date.now(), name: np.name, client: np.client, pct: 0, due: np.due || '2026-07-01', value: Number(np.value) || 0 },
    ])
    setNp({ name: '', client: '', value: '', due: '' })
    setShowAddProject(false)
  }

  const addLead = () => {
    if (!nl.name.trim()) return
    setLeads((l) => [
      ...l,
      { id: Date.now(), name: nl.name, src: nl.src, value: Number(nl.value) || 0, stage: 'new' },
    ])
    setNl({ name: '', src: '', value: '' })
    setShowAddLead(false)
  }

  const advanceLead = (id: number) => {
    setLeads((ls) =>
      ls.map((l) => {
        if (l.id !== id) return l
        const i = STAGE_ORDER.indexOf(l.stage)
        return { ...l, stage: STAGE_ORDER[(i + 1) % STAGE_ORDER.length] }
      })
    )
  }

  const updateProjectPct = (id: number, pct: number) =>
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, pct } : p)))

  const TABS = ['overview', 'clients', 'projects', 'invoices', 'leads']

  return (
    <PageWrapper title="Business Management" subtitle="Your CEO command centre 💼">

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Revenue MTD" value="R24,800" sub="↑ 18% vs April" subUp icon={<TrendingUp size={12} />} />
        <StatCard label="Active clients" value={String(clients.filter((c) => c.status === 'active').length)} sub="Retainer + project" icon={<Users size={12} />} />
        <StatCard
          label="Invoices due"
          value={`R${invoices.filter((i) => i.status === 'overdue' || i.status === 'pending').reduce((a, b) => a + b.amount, 0).toLocaleString()}`}
          sub={`${invoices.filter((i) => i.status === 'overdue').length} overdue`}
          subUp={false}
          icon={<FileText size={12} />}
        />
        <StatCard label="Growth goal" value="74%" sub="On track for R32k" subUp icon={<TrendingUp size={12} />} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button variant="ghost" onClick={() => setShowAddClient((v) => !v)}>
          <Plus size={13} /> Add client
        </Button>
        <Button onClick={() => setShowAddProject((v) => !v)}>
          <Plus size={13} /> New project
        </Button>
        <Button variant="lav" onClick={() => setShowAddLead((v) => !v)}>
          <Plus size={13} /> Add lead
        </Button>
      </div>

      {/* Add client form */}
      <AnimatePresence>
        {showAddClient && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <Card>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium" style={{ color: '#C73E74' }}>New client</span>
                <button onClick={() => setShowAddClient(false)}><X size={14} style={{ color: '#C73E74' }} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input label="Full name" value={nc.name} onChange={(v) => setNc((x) => ({ ...x, name: v }))} placeholder="Lena Dlamini" />
                <Input label="Business / niche" value={nc.biz} onChange={(v) => setNc((x) => ({ ...x, biz: v }))} placeholder="Fashion brand" />
                <Select label="Service" value={nc.service} onChange={(v) => setNc((x) => ({ ...x, service: v }))} options={SERVICES.map((s) => ({ value: s, label: s }))} />
                <Input label="Monthly value (R)" value={nc.value} onChange={(v) => setNc((x) => ({ ...x, value: v }))} placeholder="4500" type="number" />
              </div>
              <Button onClick={addClient}>Save client</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add project form */}
      <AnimatePresence>
        {showAddProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <Card>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium" style={{ color: '#C73E74' }}>New project</span>
                <button onClick={() => setShowAddProject(false)}><X size={14} style={{ color: '#C73E74' }} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input label="Project name" value={np.name} onChange={(v) => setNp((x) => ({ ...x, name: v }))} placeholder="Brand refresh" />
                <Input label="Client name" value={np.client} onChange={(v) => setNp((x) => ({ ...x, client: v }))} placeholder="Lena Dlamini" />
                <Input label="Value (R)" value={np.value} onChange={(v) => setNp((x) => ({ ...x, value: v }))} type="number" placeholder="4500" />
                <Input label="Due date" value={np.due} onChange={(v) => setNp((x) => ({ ...x, due: v }))} type="date" />
              </div>
              <Button onClick={addProject}>Add project</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-0 mb-4 border-b" style={{ borderColor: '#F5C8E2' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 text-xs capitalize border-b-2 transition-all -mb-px"
            style={{
              borderBottomColor: tab === t ? '#EA4C89' : 'transparent',
              color: tab === t ? '#EA4C89' : '#888',
              fontWeight: tab === t ? 500 : 400,
            }}
          >
            {t === 'leads' ? 'Lead pipeline' : t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <SectionHeader title="Revenue by month" icon={<BarChart3 size={13} />} />
            <ResponsiveContainer width="100%" height={160}>
              <RechartsBarChart data={revData} barSize={28}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis hide />
               <Tooltip
  formatter={(value) => `R${Number(value).toLocaleString()}`}
  contentStyle={{
    fontSize: 11,
    borderRadius: 8,
    border: '0.5px solid #F5C8E2',
  }}
/>
                <Bar dataKey="rev" radius={[4, 4, 0, 0]} fill="#F5C8E2" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <SectionHeader title="Growth goals" icon={<TrendingUp size={13} />} />
            {[
              { name: 'Monthly revenue', pct: 77 },
              { name: 'Client base', pct: 60 },
              { name: 'TikTok leads', pct: 45 },
              { name: 'Retainer clients', pct: 33 },
              { name: 'Passive income', pct: 20 },
            ].map((g) => (
              <div key={g.name} className="mb-2.5">
                <div className="flex justify-between text-[11px] mb-1" style={{ color: '#555' }}>
                  <span>{g.name}</span>
                  <span style={{ color: '#EA4C89' }}>{g.pct}%</span>
                </div>
                <ProgressBar value={g.pct} color="lav" height={5} />
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader title="Revenue by service" icon={<Briefcase size={13} />} />
            {[
              { name: 'Web design', val: 9500 },
              { name: 'Brand identity', val: 7200 },
              { name: 'Social media', val: 4800 },
              { name: 'Copywriting', val: 3300 },
            ].map((s) => (
              <div key={s.name} className="mb-2.5">
                <div className="flex justify-between text-[11px] mb-1" style={{ color: '#555' }}>
                  <span>{s.name}</span>
                  <span style={{ color: '#EA4C89' }}>R{s.val.toLocaleString()}</span>
                </div>
                <ProgressBar value={s.val} max={9500} height={5} />
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader title="Quick stats" icon={<TrendingUp size={13} />} />
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: String(projects.length), lbl: 'Active projects' },
                { val: 'R' + Math.round(clients.reduce((a, b) => a + b.value, 0) / clients.length).toLocaleString(), lbl: 'Avg client value' },
                { val: '94%', lbl: 'Client retention' },
                { val: '4.9 ★', lbl: 'Avg rating' },
              ].map((s) => (
                <div key={s.lbl} className="text-center p-3 rounded-2xl" style={{ background: '#FFF7FB', border: '0.5px solid #F5C8E2' }}>
                  <div className="text-lg font-semibold" style={{ color: '#EA4C89' }}>{s.val}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#888' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Clients */}
      {tab === 'clients' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {clients.map((c) => (
              <Card
                key={c.id}
                hover
                onClick={() => setSelectedClient(selectedClient?.id === c.id ? null : c)}
                style={selectedClient?.id === c.id ? { borderColor: '#EA4C89', borderWidth: 1 } : {}}
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ background: '#FBEAF0', color: '#72243E' }}
                  >
                    {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <Badge color={statusColor[c.status]}>{c.status}</Badge>
                </div>
                <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{c.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: '#888' }}>{c.biz} · {c.service}</div>
                <div className="text-xs font-medium mt-1.5" style={{ color: '#EA4C89' }}>R{c.value.toLocaleString()}/mo</div>
              </Card>
            ))}
          </div>
          <AnimatePresence>
            {selectedClient && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <Card>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{selectedClient.name}</span>
                    <button onClick={() => setSelectedClient(null)}><X size={14} style={{ color: '#C73E74' }} /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[
                      { val: selectedClient.service, lbl: 'Service' },
                      { val: `R${selectedClient.value.toLocaleString()}`, lbl: 'Monthly value' },
                      { val: selectedClient.status, lbl: 'Status' },
                    ].map((s) => (
                      <div key={s.lbl} className="text-center p-2.5 rounded-2xl" style={{ background: '#FFF7FB', border: '0.5px solid #F5C8E2' }}>
                        <div className="text-xs font-medium" style={{ color: '#1A1A1A' }}>{s.val}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: '#888' }}>{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  {selectedClient.notes && (
                    <div className="text-xs p-3 rounded-xl" style={{ background: '#FFEAF4', color: '#555' }}>
                      📝 {selectedClient.notes}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Projects */}
      {tab === 'projects' && (
        <Card>
          <SectionHeader title="Active projects" icon={<Briefcase size={13} />} />
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="p-3 rounded-2xl" style={{ background: '#FFF7FB', border: '0.5px solid #F5C8E2' }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{p.name}</div>
                    <div className="text-[11px]" style={{ color: '#888' }}>{p.client} · due {p.due.slice(5)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium" style={{ color: '#EA4C89' }}>R{p.value.toLocaleString()}</div>
                    <div className="text-[10px]" style={{ color: '#888' }}>{p.pct}%</div>
                  </div>
                </div>
                <ProgressBar value={p.pct} />
                <input
                  type="range" min={0} max={100} value={p.pct}
                  onChange={(e) => updateProjectPct(p.id, Number(e.target.value))}
                  className="w-full mt-2 h-1"
                  style={{ accentColor: '#EA4C89' }}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Invoices */}
      {tab === 'invoices' && (
        <Card>
          <SectionHeader title="Invoice tracker" icon={<FileText size={13} />} />
          <div className="grid grid-cols-5 gap-2 mb-2 text-[10px] font-medium px-1" style={{ color: '#C73E74' }}>
            <span>Invoice</span><span>Client</span><span>Amount</span><span>Due</span><span>Status</span>
          </div>
          {invoices.map((inv) => (
            <div key={inv.id} className="grid grid-cols-5 gap-2 items-center py-2 border-b last:border-0 px-1" style={{ borderColor: '#FFEAF4' }}>
              <span className="text-xs font-medium" style={{ color: '#C73E74' }}>{inv.id}</span>
              <span className="text-xs" style={{ color: '#1A1A1A' }}>{inv.client}</span>
              <span className="text-xs font-medium" style={{ color: '#1A1A1A' }}>R{inv.amount.toLocaleString()}</span>
              <span className="text-[11px]" style={{ color: '#888' }}>{inv.due.slice(5)}</span>
              <Badge color={invColor[inv.status]}>{inv.status}</Badge>
            </div>
          ))}
        </Card>
      )}

      {/* Leads */}
      {tab === 'leads' && (
        <div>
          <AnimatePresence>
            {showAddLead && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                <Card>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium" style={{ color: '#C73E74' }}>New lead</span>
                    <button onClick={() => setShowAddLead(false)}><X size={14} style={{ color: '#C73E74' }} /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <Input label="Name" value={nl.name} onChange={(v) => setNl((x) => ({ ...x, name: v }))} placeholder="Simone Jacobs" />
                    <Input label="Source" value={nl.src} onChange={(v) => setNl((x) => ({ ...x, src: v }))} placeholder="TikTok" />
                    <Input label="Est. value (R)" value={nl.value} onChange={(v) => setNl((x) => ({ ...x, value: v }))} type="number" placeholder="5000" />
                  </div>
                  <Button onClick={addLead}>Add lead</Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          <Card>
            <SectionHeader
              title="Lead pipeline"
              icon={<Filter size={13} />}
              action={<span className="text-[10px]" style={{ color: '#888' }}>Click stage pill to advance</span>}
            />
            <div className="space-y-2">
              {leads.map((l) => (
                <div key={l.id} className="flex items-center gap-3 py-2 px-3 rounded-2xl" style={{ background: '#FFF7FB', border: '0.5px solid #F5C8E2' }}>
                  <span className="text-xs font-medium flex-1" style={{ color: '#1A1A1A' }}>{l.name}</span>
                  <span className="text-[11px]" style={{ color: '#888', minWidth: 64 }}>{l.src}</span>
                  <span className="text-xs font-medium" style={{ color: '#EA4C89', minWidth: 56 }}>~R{l.value.toLocaleString()}</span>
                  <button onClick={() => advanceLead(l.id)}>
                    <Badge color={STAGE_COLOR[l.stage]}>{STAGE_LABELS[l.stage]}</Badge>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  )
}
