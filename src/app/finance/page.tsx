'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Wallet, Plus, X, TrendingUp, TrendingDown, PiggyBank, CreditCard } from 'lucide-react'
import { Card, Button, Badge, ProgressBar, SectionHeader, PageWrapper, Input, Select } from '@/components/ui'

type Tx = { id: number; desc: string; amount: number; type: 'income' | 'expense'; category: string; date: string }

const CATEGORIES = ['Client payment','Freelance','Product sale','Food','Subscriptions','Transport','Shopping','Self-care','Other']
const PIE_COLORS = ['#EA4C89','#D8C1E8','#F5C8E2','#FBEAF0','#C73E74','#EEE8F5']
const monthlyData = [
  { month: 'Jan', income: 18500, expenses: 7200 },
  { month: 'Feb', income: 16800, expenses: 8100 },
  { month: 'Mar', income: 21000, expenses: 6900 },
  { month: 'Apr', income: 19500, expenses: 9200 },
  { month: 'May', income: 24800, expenses: 8200 },
]

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Tx[]>([
    { id: 1, desc: 'Zara Mokoena — web project', amount: 6000, type: 'income', category: 'Client payment', date: '2026-05-20' },
    { id: 2, desc: 'Ayasha Pillay — full package', amount: 8500, type: 'income', category: 'Client payment', date: '2026-05-18' },
    { id: 3, desc: 'Lena Dlamini — brand identity', amount: 4500, type: 'income', category: 'Client payment', date: '2026-05-15' },
    { id: 4, desc: 'Groceries — Pick n Pay', amount: 1200, type: 'expense', category: 'Food', date: '2026-05-22' },
    { id: 5, desc: 'Netflix, Spotify, Adobe', amount: 890, type: 'expense', category: 'Subscriptions', date: '2026-05-01' },
    { id: 6, desc: 'Uber rides', amount: 650, type: 'expense', category: 'Transport', date: '2026-05-19' },
    { id: 7, desc: 'Skincare haul', amount: 1800, type: 'expense', category: 'Self-care', date: '2026-05-12' },
    { id: 8, desc: 'TikTok shop product sale', amount: 5800, type: 'income', category: 'Product sale', date: '2026-05-10' },
  ])

  const [savings, setSavings] = useState([
    { id: 1, name: 'Emergency fund', target: 20000, saved: 14500 },
    { id: 2, name: 'MacBook Pro', target: 35000, saved: 12000 },
    { id: 3, name: 'Holiday — Bali', target: 18000, saved: 5400 },
    { id: 4, name: 'Business investment', target: 50000, saved: 8000 },
  ])

  const subs = [
    { name: 'Netflix', amount: 199, date: '1st' },
    { name: 'Spotify', amount: 99, date: '1st' },
    { name: 'Adobe CC', amount: 599, date: '5th' },
    { name: 'Canva Pro', amount: 189, date: '12th' },
    { name: 'ChatGPT Plus', amount: 350, date: '15th' },
  ]

  const [showAdd, setShowAdd] = useState(false)
  const [newTx, setNewTx] = useState({ desc: '', amount: '', type: 'income' as 'income' | 'expense', category: 'Client payment', date: '' })

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((a, b) => a + b.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((a, b) => a + b.amount, 0)
  const netProfit = totalIncome - totalExpenses

  const expByCategory = CATEGORIES.map((c) => ({
    name: c,
    value: transactions.filter((t) => t.type === 'expense' && t.category === c).reduce((a, b) => a + b.amount, 0),
  })).filter((c) => c.value > 0)

  const addTx = () => {
    if (!newTx.desc.trim() || !newTx.amount) return
    setTransactions((ts) => [{ id: Date.now(), ...newTx, amount: Number(newTx.amount), date: newTx.date || new Date().toISOString().slice(0, 10) }, ...ts])
    setNewTx({ desc: '', amount: '', type: 'income', category: 'Client payment', date: '' })
    setShowAdd(false)
  }

  return (
    <PageWrapper title="Finance Dashboard" subtitle="Your money, your empire 💰">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Card><div className="text-[11px] mb-1 flex items-center gap-1" style={{ color: '#C73E74' }}><TrendingUp size={12} /> Income MTD</div><div className="text-xl font-semibold">R{totalIncome.toLocaleString()}</div><div className="text-[10px] mt-1" style={{ color: '#3B6D11' }}>↑ 18% vs April</div></Card>
        <Card><div className="text-[11px] mb-1 flex items-center gap-1" style={{ color: '#C73E74' }}><TrendingDown size={12} /> Expenses MTD</div><div className="text-xl font-semibold">R{totalExpenses.toLocaleString()}</div><div className="text-[10px] mt-1 text-gray-400">{transactions.filter((t) => t.type === 'expense').length} transactions</div></Card>
        <Card><div className="text-[11px] mb-1 flex items-center gap-1" style={{ color: '#C73E74' }}><Wallet size={12} /> Net profit</div><div className="text-xl font-semibold" style={{ color: netProfit > 0 ? '#3B6D11' : '#A32D2D' }}>R{netProfit.toLocaleString()}</div><div className="text-[10px] mt-1 text-gray-400">After all expenses</div></Card>
        <Card><div className="text-[11px] mb-1 flex items-center gap-1" style={{ color: '#C73E74' }}><CreditCard size={12} /> Subscriptions</div><div className="text-xl font-semibold">R{subs.reduce((a, b) => a + b.amount, 0).toLocaleString()}</div><div className="text-[10px] mt-1 text-gray-400">{subs.length} active subs</div></Card>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={() => setShowAdd((v) => !v)}><Plus size={13} /> Add transaction</Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
            <Card>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium" style={{ color: '#C73E74' }}>New transaction</span>
                <button onClick={() => setShowAdd(false)}><X size={14} style={{ color: '#C73E74' }} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input label="Description" value={newTx.desc} onChange={(v) => setNewTx((x) => ({ ...x, desc: v }))} placeholder="Zara — web project" />
                <Input label="Amount (R)" value={newTx.amount} onChange={(v) => setNewTx((x) => ({ ...x, amount: v }))} type="number" placeholder="5000" />
                <Select label="Type" value={newTx.type} onChange={(v) => setNewTx((x) => ({ ...x, type: v as 'income' | 'expense' }))} options={[{ value: 'income', label: 'Income' }, { value: 'expense', label: 'Expense' }]} />
                <Select label="Category" value={newTx.category} onChange={(v) => setNewTx((x) => ({ ...x, category: v }))} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
              </div>
              <Button onClick={addTx}>Save transaction</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <SectionHeader title="Income vs expenses — 5 months" icon={<TrendingUp size={13} />} />
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EA4C89" stopOpacity={0.3} /><stop offset="95%" stopColor="#EA4C89" stopOpacity={0} /></linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D8C1E8" stopOpacity={0.3} /><stop offset="95%" stopColor="#D8C1E8" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis hide />
             <Tooltip formatter={(v: unknown) => `R${Number(v).toLocaleString()}`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area type="monotone" dataKey="income" stroke="#EA4C89" fill="url(#gInc)" strokeWidth={2} name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#D8C1E8" fill="url(#gExp)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionHeader title="Spending breakdown" icon={<PiggyBank size={13} />} />
          {expByCategory.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={expByCategory} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" nameKey="name">
                    {expByCategory.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => `R${Number(v).toLocaleString()}`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-1">
                {expByCategory.slice(0, 4).map((c, i) => (
                  <div key={c.name} className="flex justify-between text-[10px]">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} /><span style={{ color: '#555' }}>{c.name}</span></div>
                    <span style={{ color: '#1A1A1A', fontWeight: 500 }}>R{c.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (<div className="text-[11px] text-gray-400 text-center py-6">No expenses yet</div>)}
        </Card>

        <Card className="lg:col-span-2">
          <SectionHeader title="Recent transactions" icon={<Wallet size={13} />} />
          <div className="space-y-1.5">
            {transactions.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-1.5 border-b last:border-0" style={{ borderColor: '#FFEAF4' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: t.type === 'income' ? '#EAF3DE' : '#FBEAF0' }}>
                  {t.type === 'income' ? <TrendingUp size={12} style={{ color: '#27500A' }} /> : <TrendingDown size={12} style={{ color: '#72243E' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate" style={{ color: '#1A1A1A' }}>{t.desc}</div>
                  <div className="text-[10px]" style={{ color: '#888' }}>{t.category} · {t.date.slice(5)}</div>
                </div>
                <div className="text-xs font-medium" style={{ color: t.type === 'income' ? '#3B6D11' : '#A32D2D' }}>
                  {t.type === 'income' ? '+' : '−'} R{t.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Savings goals" icon={<PiggyBank size={13} />} action={<Button variant="ghost" onClick={() => { const name = prompt('Goal name?'); const target = Number(prompt('Target amount?')); if (name && target) setSavings((s) => [...s, { id: Date.now(), name, target, saved: 0 }]) }}><Plus size={12} /></Button>} />
          <div className="space-y-3">
            {savings.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-[11px] mb-1"><span style={{ color: '#555' }}>{s.name}</span><span style={{ color: '#EA4C89' }}>R{s.saved.toLocaleString()} / R{s.target.toLocaleString()}</span></div>
                <ProgressBar value={s.saved} max={s.target} color="lav" height={5} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <SectionHeader title="Subscription tracker" icon={<CreditCard size={13} />} action={<span className="text-xs font-medium" style={{ color: '#EA4C89' }}>R{subs.reduce((a, b) => a + b.amount, 0)}/mo</span>} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {subs.map((s) => (
              <div key={s.name} className="p-3 rounded-2xl text-center" style={{ background: '#FFF7FB', border: '0.5px solid #F5C8E2' }}>
                <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{s.name}</div>
                <div className="text-lg font-semibold mt-1" style={{ color: '#EA4C89' }}>R{s.amount}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#888' }}>Renews {s.date}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}