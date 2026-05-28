'use client'

import { useState, useEffect } from 'react'
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

import { supabase } from '@/lib/supabase'

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

type Client = {
  id: number
  name: string
  biz: string
  service: string
  value: number
  status: string
  notes: string
}

export default function BusinessPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)

  const [showAddClient, setShowAddClient] = useState(false)

  const [nc, setNc] = useState({
    name: '',
    biz: '',
    service: 'Brand identity',
    value: '',
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setLoadingClients(true)

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setClients(data || [])
    }

    setLoadingClients(false)
  }

  const addClient = async () => {
    if (!nc.name.trim()) return

    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          name: nc.name,
          biz: nc.biz,
          service: nc.service,
          value: Number(nc.value) || 0,
          status: 'pending',
          notes: '',
        },
      ])
      .select()

    if (error) {
      console.error(error)
      return
    }

    if (data) {
      setClients((c) => [...data, ...c])
    }

    setNc({
      name: '',
      biz: '',
      service: 'Brand identity',
      value: '',
    })

    setShowAddClient(false)
  }

  const statusColor: Record<
    string,
    'green' | 'yellow' | 'gray' | 'red'
  > = {
    active: 'green',
    pending: 'yellow',
    done: 'gray',
    overdue: 'red',
  }

  return (
    <PageWrapper
      title="Business Management"
      subtitle="Your CEO command centre 💼"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Revenue MTD"
          value="R24,800"
          sub="↑ 18% vs April"
          subUp
          icon={<TrendingUp size={12} />}
        />

        <StatCard
          label="Active clients"
          value={String(
            clients.filter((c) => c.status === 'active').length
          )}
          sub="Retainer + project"
          icon={<Users size={12} />}
        />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant="ghost"
          onClick={() => setShowAddClient((v) => !v)}
        >
          <Plus size={13} /> Add client
        </Button>
      </div>

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
                <span
                  className="text-xs font-medium"
                  style={{ color: '#C73E74' }}
                >
                  New client
                </span>

                <button
                  onClick={() => setShowAddClient(false)}
                >
                  <X
                    size={14}
                    style={{ color: '#C73E74' }}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input
                  label="Full name"
                  value={nc.name}
                  onChange={(v) =>
                    setNc((x) => ({ ...x, name: v }))
                  }
                  placeholder="Lena Dlamini"
                />

                <Input
                  label="Business / niche"
                  value={nc.biz}
                  onChange={(v) =>
                    setNc((x) => ({ ...x, biz: v }))
                  }
                  placeholder="Fashion brand"
                />

                <Select
                  label="Service"
                  value={nc.service}
                  onChange={(v) =>
                    setNc((x) => ({ ...x, service: v }))
                  }
                  options={SERVICES.map((s) => ({
                    value: s,
                    label: s,
                  }))}
                />

                <Input
                  label="Monthly value (R)"
                  value={nc.value}
                  onChange={(v) =>
                    setNc((x) => ({ ...x, value: v }))
                  }
                  placeholder="4500"
                  type="number"
                />
              </div>

              <Button onClick={addClient}>
                Save client
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <Card>
          <SectionHeader
            title="Revenue by month"
            icon={<BarChart3 size={13} />}
          />

          <ResponsiveContainer
            width="100%"
            height={160}
          >
            <RechartsBarChart
              data={revData}
              barSize={28}
            >
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 10,
                  fill: '#888',
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis hide />

              <Tooltip
                formatter={(value) =>
                  `R${Number(value).toLocaleString()}`
                }
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: '0.5px solid #F5C8E2',
                }}
              />

              <Bar
                dataKey="rev"
                radius={[4, 4, 0, 0]}
                fill="#F5C8E2"
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {loadingClients ? (
          <div
            className="text-sm p-4 rounded-2xl"
            style={{
              background: '#FFF7FB',
              color: '#888',
              border: '0.5px solid #F5C8E2',
            }}
          >
            Loading clients...
          </div>
        ) : (
          clients.map((c) => (
            <Card
              key={c.id}
              hover
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    background: '#FBEAF0',
                    color: '#72243E',
                  }}
                >
                  {c.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <Badge color={statusColor[c.status]}>
                  {c.status}
                </Badge>
              </div>

              <div
                className="text-sm font-medium"
                style={{ color: '#1A1A1A' }}
              >
                {c.name}
              </div>

              <div
                className="text-[11px] mt-0.5"
                style={{ color: '#888' }}
              >
                {c.biz} · {c.service}
              </div>

              <div
                className="text-xs font-medium mt-1.5"
                style={{ color: '#EA4C89' }}
              >
                R{c.value.toLocaleString()}/mo
              </div>
            </Card>
          ))
        )}
      </div>
    </PageWrapper>
  )
}
